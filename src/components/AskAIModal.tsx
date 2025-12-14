"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function AskAIModal({
  open,
  onOpenChange,
  noteText,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteText: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hi! I’m your note assistant. Ask me anything about your note — I’ll help you refine or understand it better.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to send message to API
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: noteText,
          question: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          typeof data?.error === "string"
            ? data.error
            : "The AI request failed. Please try again.";
        setMessages((prev) => [...prev, { role: "ai", content: msg }]);
        return;
      }

      const aiResponse =
        typeof data?.answer === "string" && data.answer.trim().length > 0
          ? data.answer
          : "I couldn't produce a response. If this persists, try rephrasing your question.";

      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong while contacting AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col overflow-hidden rounded-2xl border bg-white text-gray-900 shadow-2xl dark:bg-neutral-950 dark:text-white dark:border-neutral-800">
        {/* Header */}
        <DialogHeader className="px-8 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Ask AI About Your Note
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Summarize, expand, or ask anything about your note with AI.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Note Preview */}
        <div className="mx-8 mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-gray-700 dark:bg-neutral-900 dark:border-neutral-800 dark:text-gray-300">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Your Note
          </div>
          <div className="max-h-32 overflow-auto whitespace-pre-wrap text-[0.9rem]">
            {noteText || "(Your note is empty)"}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    : "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-100"
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-70">
                  {m.role === "ai" ? "AI Assistant" : "You"}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-gray-100 dark:bg-neutral-800 px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse text-indigo-500" />
                <span className="italic">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-200 bg-neutral-50 px-8 py-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <input
              className="h-12 flex-1 rounded-xl border border-neutral-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-neutral-950 dark:border-neutral-700 dark:text-white dark:placeholder:text-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your note..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              type="button"
              onClick={sendMessage}
              size="lg"
              disabled={loading}
              className="h-12 px-6 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
