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

    // Show user message immediately
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      // Call backend Gemini route
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
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: msg },
        ]);
        return;
      }

      const aiResponse =
        (typeof data?.answer === "string" && data.answer.trim().length > 0)
          ? data.answer
          : "I couldn't produce a response. If this persists, try rephrasing your question.";

      // Add AI message
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
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Ask AI About Your Note</DialogTitle>
              <DialogDescription className="text-sm">
                Chat with AI to summarize, extract insights, or ask questions about your note.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Note Preview */}
        <div className="mx-6 mt-4 rounded-lg border bg-muted/30 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your Note
          </div>
          <div className="max-h-32 overflow-auto whitespace-pre-wrap text-sm text-foreground">
            {noteText || "(Your note is empty)"}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-70">
                  {m.role === "ai" ? "AI Assistant" : "You"}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span className="italic">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input + Send */}
        <div className="border-t bg-muted/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              className="h-11 flex-1 rounded-lg border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="h-11 px-6"
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
