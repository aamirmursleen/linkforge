"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, ThumbsUp, ThumbsDown, Loader2, User, ExternalLink, Sparkles, Zap, Brain } from "lucide-react";
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

// Animated AI Icon Component
function AIIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse opacity-50 blur-sm" />
      <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full p-1.5">
        <Brain className="h-4 w-4 text-white" />
      </div>
    </div>
  );
}

// Typing Indicator Component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

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
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open AI chat"
      >
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 animate-ping opacity-20" />
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-40 blur-md group-hover:opacity-60 transition-opacity" />

        {/* Main button */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-2xl shadow-violet-500/30 transition-all group-hover:scale-110 group-hover:shadow-violet-500/50">
          <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500" />
          <div className="relative flex items-center justify-center">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* AI Badge */}
        <div className="absolute -top-1 -right-1 bg-white rounded-full px-2 py-0.5 shadow-lg border border-violet-200">
          <span className="text-[10px] font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AI</span>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            Chat with AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-3xl border border-violet-200/50 bg-white shadow-2xl shadow-violet-500/10 overflow-hidden">
      {/* Header with gradient */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600" />

        <div className="relative flex items-center justify-between px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            {/* Animated AI avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
              <div className="relative h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Brain className="h-6 w-6" />
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-400 border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">AI Assistant</h3>
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-semibold backdrop-blur-sm">
                  BETA
                </span>
              </div>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Powered by AI
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-violet-50/50 to-white">
        {messages.length === 0 && (
          <div className="text-center py-6">
            {/* Animated AI Icon */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full animate-pulse opacity-20 blur-xl" />
              <div className="absolute inset-2 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-10 w-10 text-violet-600" />
              </div>
              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "8s" }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-500 rounded-full" />
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-fuchsia-500 rounded-full" />
              </div>
            </div>

            <h4 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-1">
              Hi! I'm your AI Assistant
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              Ask me anything about LinkForge
            </p>

            <div className="space-y-2">
              <p className="text-xs text-gray-400 mb-3 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" />
                Suggested questions
              </p>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-white border border-violet-100 text-gray-700 hover:border-violet-300 hover:bg-violet-50 transition-all hover:shadow-md hover:shadow-violet-100"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-violet-500" />
                    {q}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                {message.isStreaming && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white animate-pulse" />
                )}
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-sm shadow-lg shadow-violet-200"
                  : "bg-white border border-violet-100 text-gray-700 rounded-bl-sm shadow-md"
              }`}
            >
              {message.role === "assistant" && !message.content && message.isStreaming && (
                <TypingIndicator />
              )}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

              {message.isStreaming && message.content && (
                <div className="flex items-center gap-1 mt-2 text-violet-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              )}

              {/* Tool Results */}
              {message.toolResults?.map((tr, i) => (
                <div
                  key={i}
                  className={`mt-3 p-3 rounded-xl text-xs ${
                    tr.result.success
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800"
                      : "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800"
                  }`}
                >
                  <p className="font-medium">{tr.result.message}</p>
                  {tr.result.actionRequired === "navigate" && tr.result.data?.url && (
                    <button
                      onClick={() => handleToolAction(tr.result)}
                      className="mt-2 flex items-center gap-1 text-violet-600 hover:text-violet-700 font-medium"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Go to page
                    </button>
                  )}
                </div>
              ))}

              {/* Sources */}
              {message.sources && message.sources.length > 0 && !message.isStreaming && (
                <div className="mt-3 pt-2 border-t border-violet-100">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Sources: {message.sources.slice(0, 2).join(", ")}
                  </p>
                </div>
              )}

              {/* Feedback buttons for assistant messages */}
              {message.role === "assistant" && !message.isStreaming && message.content && (
                <div className="flex gap-1 mt-3 pt-2 border-t border-violet-100">
                  <span className="text-xs text-gray-400 mr-2">Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback(message.id, 5)}
                    className="p-1.5 rounded-lg hover:bg-green-100 text-gray-400 hover:text-green-600 transition-all"
                    aria-label="Helpful"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback(message.id, 1)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                    aria-label="Not helpful"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-violet-100 p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full rounded-xl border border-violet-200 px-4 py-3 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all bg-violet-50/50 placeholder:text-gray-400"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-violet-300" />
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="rounded-xl h-12 w-12 p-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-200 transition-all hover:shadow-violet-300 disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
          <Brain className="h-3 w-3" />
          Powered by AI • LinkForge Assistant
        </p>
      </div>
    </div>
  );
}
