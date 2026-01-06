"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, ThumbsUp, ThumbsDown, Loader2, Bot, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  toolResults?: Array<{
    tool: string;
    result: {
      success: boolean;
      message: string;
      data?: any;
      actionRequired?: string;
    };
  }>;
  isStreaming?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "How do I create a short link?",
  "How do I generate a QR code?",
  "How do I view my analytics?",
  "What's included in the free plan?",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let fullContent = "";
      let toolResults: Message["toolResults"] = [];
      let sources: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "text") {
                fullContent += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                );
              } else if (data.type === "tool_result") {
                toolResults.push({
                  tool: data.tool,
                  result: data.result,
                });
              } else if (data.type === "done") {
                if (data.sessionId) setSessionId(data.sessionId);
                if (data.sources) sources = data.sources;
              } else if (data.type === "error") {
                fullContent = data.message || "An error occurred.";
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: fullContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Final update with all data
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: fullContent,
                sources,
                toolResults: toolResults.length > 0 ? toolResults : undefined,
                isStreaming: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: "Sorry, I encountered an error. Please try again.",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId]);

  const handleFeedback = async (messageId: string, rating: number) => {
    try {
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, rating }),
      });
    } catch (e) {
      console.error("Feedback error:", e);
    }
  };

  const handleToolAction = (result: NonNullable<Message["toolResults"]>[0]["result"]) => {
    if (result.actionRequired === "navigate" && result.data?.url) {
      window.location.href = result.data.url;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary)]/90 transition-all hover:scale-105"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] flex-col rounded-2xl border border-[var(--border)] bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-[var(--primary)] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold text-sm">LinkForge Assistant</h3>
            <p className="text-xs opacity-80">I can help with LinkForge features</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 hover:bg-white/20 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-[var(--primary)] opacity-50" />
            <p className="text-sm text-[var(--muted)] mb-4">
              Hi! I can help you with LinkForge features.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-[var(--muted)] mb-2">Try asking:</p>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-[var(--primary-pale)] text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[var(--primary-pale)] flex items-center justify-center">
                <Bot className="h-4 w-4 text-[var(--primary)]" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === "user"
                  ? "bg-[var(--primary)] text-white rounded-br-md"
                  : "bg-[var(--border)]/50 text-[var(--dark)] rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {message.isStreaming && (
                <Loader2 className="h-4 w-4 animate-spin mt-1" />
              )}

              {/* Tool Results */}
              {message.toolResults?.map((tr, i) => (
                <div
                  key={i}
                  className={`mt-2 p-2 rounded-lg text-xs ${
                    tr.result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  <p>{tr.result.message}</p>
                  {tr.result.actionRequired === "navigate" && tr.result.data?.url && (
                    <button
                      onClick={() => handleToolAction(tr.result)}
                      className="mt-1 flex items-center gap-1 text-[var(--primary)] hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Go to page
                    </button>
                  )}
                </div>
              ))}

              {/* Sources */}
              {message.sources && message.sources.length > 0 && !message.isStreaming && (
                <div className="mt-2 pt-2 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted)]">
                    Sources: {message.sources.slice(0, 2).join(", ")}
                  </p>
                </div>
              )}

              {/* Feedback buttons for assistant messages */}
              {message.role === "assistant" && !message.isStreaming && (
                <div className="flex gap-1 mt-2 pt-2 border-t border-[var(--border)]/50">
                  <button
                    onClick={() => handleFeedback(message.id, 5)}
                    className="p-1 rounded hover:bg-green-100 text-[var(--muted)] hover:text-green-600 transition-colors"
                    aria-label="Helpful"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(message.id, 1)}
                    className="p-1 rounded hover:bg-red-100 text-[var(--muted)] hover:text-red-600 transition-colors"
                    aria-label="Not helpful"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[var(--primary)] flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about LinkForge..."
            className="flex-1 rounded-full border border-[var(--border)] px-4 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="rounded-full h-10 w-10 p-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-[var(--muted)] text-center mt-2">
          I can only help with LinkForge features
        </p>
      </div>
    </div>
  );
}
