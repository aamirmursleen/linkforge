import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { AI_CONFIG } from "@/lib/ai/config";
import { retrieveRelevantDocs, formatContextForPrompt, extractSourceCitations } from "@/lib/ai/retrieval";
import { executeTool, getToolsForAnthropic, ToolName } from "@/lib/ai/tools";
import { v4 as uuidv4 } from "uuid";
import { LRUCache } from "lru-cache";
import crypto from "crypto";

// Rate limiting cache
const rateLimitCache = new LRUCache<string, number[]>({
  max: 10000,
  ttl: 60 * 1000, // 1 minute
});

// FAQ cache for common questions
const faqCache = new LRUCache<string, { answer: string; sources: string[] }>({
  max: AI_CONFIG.cacheMaxSize,
  ttl: AI_CONFIG.cacheTTLMs,
});

function hashQuestion(question: string): string {
  const normalized = question.toLowerCase().trim().replace(/[^\w\s]/g, "");
  return crypto.createHash("md5").update(normalized).digest("hex");
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const requests = rateLimitCache.get(ip) || [];

  // Filter out old requests
  const recentRequests = requests.filter((t) => now - t < windowMs);

  if (recentRequests.length >= AI_CONFIG.rateLimitPerMinute) {
    return false;
  }

  recentRequests.push(now);
  rateLimitCache.set(ip, recentRequests);
  return true;
}

function isOffTopic(message: string): boolean {
  const offTopicPatterns = [
    /write (me )?(a |some )?code/i,
    /help me (with )?(my )?(homework|assignment|essay)/i,
    /what('s| is) the (weather|news|stock)/i,
    /tell me (a )?joke/i,
    /who (is|was) (the )?(president|prime minister)/i,
    /medical advice/i,
    /legal advice/i,
    /ignore (your |the )?(previous |above )?(instructions|prompt)/i,
    /what('s| is) your (system )?prompt/i,
    /reveal your instructions/i,
    /pretend (you are|to be)/i,
    /act as/i,
    /you are now/i,
  ];

  return offTopicPatterns.some((pattern) => pattern.test(message));
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, sessionId: providedSessionId, userId } = body;

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > 2000) {
      return Response.json(
        { error: "Message too long. Please keep it under 2000 characters." },
        { status: 400 }
      );
    }

    // Check for off-topic/prompt injection attempts
    if (isOffTopic(message)) {
      return Response.json({
        response: AI_CONFIG.offTopicResponse,
        sessionId: providedSessionId || uuidv4(),
        sources: [],
        cached: false,
      });
    }

    // Check FAQ cache
    const questionHash = hashQuestion(message);
    const cachedAnswer = faqCache.get(questionHash);

    if (cachedAnswer) {
      // Update cache hit in database
      await prisma.aIFaqCache
        .update({
          where: { questionHash },
          data: { hitCount: { increment: 1 }, lastHitAt: new Date() },
        })
        .catch(() => {}); // Ignore errors

      return Response.json({
        response: cachedAnswer.answer,
        sessionId: providedSessionId || uuidv4(),
        sources: cachedAnswer.sources,
        cached: true,
        latencyMs: Date.now() - startTime,
      });
    }

    // Create or get session
    const sessionId = providedSessionId || uuidv4();

    let session = await prisma.aIChatSession.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 10 } },
    });

    if (!session) {
      session = await prisma.aIChatSession.create({
        data: {
          sessionId,
          userId,
        },
        include: { messages: true },
      });
    }

    // Retrieve relevant documents
    const relevantDocs = await retrieveRelevantDocs(message);
    const context = formatContextForPrompt(relevantDocs);
    const sources = extractSourceCitations(relevantDocs);

    // Build conversation history
    const conversationHistory = session.messages
      .reverse()
      .slice(-6) // Last 3 exchanges
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "AI service not configured. Please contact support." },
        { status: 503 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Build messages
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory,
      {
        role: "user",
        content: `${context}\n\n---\n\nUser question: ${message}`,
      },
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        let toolCalls: any[] = [];

        try {
          const response = await anthropic.messages.create({
            model: AI_CONFIG.model,
            max_tokens: AI_CONFIG.maxTokens,
            temperature: AI_CONFIG.temperature,
            system: AI_CONFIG.systemPrompt,
            messages,
            tools: getToolsForAnthropic(),
            stream: true,
          });

          for await (const event of response) {
            if (event.type === "content_block_delta") {
              const delta = event.delta;
              if ("text" in delta) {
                fullResponse += delta.text;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "text", content: delta.text })}\n\n`
                  )
                );
              } else if ("partial_json" in delta && toolCalls.length > 0) {
                // Accumulate tool input JSON
                const lastTool = toolCalls[toolCalls.length - 1];
                lastTool.inputJson = (lastTool.inputJson || "") + delta.partial_json;
              }
            } else if (event.type === "content_block_start") {
              if (event.content_block.type === "tool_use") {
                toolCalls.push({
                  id: event.content_block.id,
                  name: event.content_block.name,
                  input: {},
                });
              }
            } else if (event.type === "message_stop") {
              // Process tool calls
              for (const tool of toolCalls) {
                if (tool.inputJson) {
                  try {
                    tool.input = JSON.parse(tool.inputJson);
                  } catch {
                    tool.input = {};
                  }
                }

                const toolResult = await executeTool(tool.name as ToolName, tool.input, {
                  userId,
                  sessionId,
                  ipAddress: ip,
                });

                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "tool_result",
                      tool: tool.name,
                      result: toolResult,
                    })}\n\n`
                  )
                );

                if (toolResult.message) {
                  fullResponse += `\n\n${toolResult.message}`;
                }
              }
            }
          }

          // Save messages to database
          const latencyMs = Date.now() - startTime;

          await prisma.aIChatMessage.createMany({
            data: [
              {
                sessionId: session!.id,
                role: "user",
                content: message,
              },
              {
                sessionId: session!.id,
                role: "assistant",
                content: fullResponse,
                sources: JSON.stringify(sources),
                toolCalls: toolCalls.length > 0 ? JSON.stringify(toolCalls) : null,
                latencyMs,
              },
            ],
          });

          // Cache if it's a good answer (no tools, reasonable length)
          if (toolCalls.length === 0 && fullResponse.length > 50 && fullResponse.length < 2000) {
            faqCache.set(questionHash, { answer: fullResponse, sources });

            await prisma.aIFaqCache
              .upsert({
                where: { questionHash },
                create: {
                  questionHash,
                  question: message,
                  answer: fullResponse,
                  sources: JSON.stringify(sources),
                },
                update: {
                  answer: fullResponse,
                  sources: JSON.stringify(sources),
                },
              })
              .catch(() => {});
          }

          // Send completion
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "done",
                sessionId,
                sources,
                latencyMs,
              })}\n\n`
            )
          );
        } catch (error: any) {
          console.error("Chat error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                message: "I encountered an issue. Please try again.",
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
