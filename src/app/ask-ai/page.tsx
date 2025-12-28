"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, ArrowLeft, Copy, Check, Plus, Trash2, MessageCircle } from "lucide-react";
import {
  createConversation,
  addMessage,
  getConversations,
  getConversationWithMessages,
  deleteConversation,
  generateTitleFromMessage,
  type Conversation,
} from "@/lib/conversations"; 
import { toast } from "sonner";

type Message = {
  role: "user" | "ai";
  content: string;
};

// ✅ Wrap in Suspense to handle useSearchParams during SSR
export default function AskAIPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AskAIContent />
    </Suspense>
  );
}

function AskAIContent() {
  const params = useSearchParams();
  const noteText = params.get("note") ?? "";
  const conversationId = params.get("conversation") ?? "";

  return <AskAIClient noteText={noteText} conversationId={conversationId} />;
}

// ✅ Split out your client-side logic here:
function AskAIClient({
  noteText,
  conversationId: initialConvId,
}: {
  noteText: string;
  conversationId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hi! I'm your AI note assistant. Ask me anything about your note — I can help you summarize, expand, refine, or understand it better. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(initialConvId || null);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const convs = await getConversations();
        setConversations(convs);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };
    loadConversations();
  }, []);

  // Load messages when conversation ID changes
  useEffect(() => {
    const loadConversationMessages = async () => {
      if (currentConversationId) {
        try {
          const result = await getConversationWithMessages(currentConversationId);
          if (result && result.messages) {
            const mappedMessages = result.messages.map((msg: { role: "user" | "ai"; content: string }) => ({
              role: msg.role,
              content: msg.content,
            }));
            setMessages(mappedMessages.length > 0 ? mappedMessages : [
              {
                role: "ai",
                content: "Hi! I'm your AI note assistant. Ask me anything about your note — I can help you summarize, expand, refine, or understand it better. What would you like to know?",
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to load conversation messages:", error);
          toast.error("Failed to load conversation");
        }
      }
    };
    loadConversationMessages();
  }, [currentConversationId]);

  // Create new conversation
  const handleNewConversation = async () => {
    try {
      const newConv = await createConversation(undefined, "New Conversation");
      if (newConv) {
        setCurrentConversationId(newConv.id);
        setMessages([
          {
            role: "ai",
            content:
              "Hi! I'm your AI note assistant. Ask me anything about your note — I can help you summarize, expand, refine, or understand it better. What would you like to know?",
          },
        ]);
        setConversations([newConv, ...conversations]);
        toast.success("New conversation started!");
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to create conversation");
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (convId: string) => {
    try {
      const deleted = await deleteConversation(convId);
      if (deleted) {
        setConversations((prev) => prev.filter((c) => c.id !== convId));
        if (currentConversationId === convId) {
          setCurrentConversationId(null);
          setMessages([
            {
              role: "ai",
              content:
                "Hi! I'm your AI note assistant. Ask me anything about your note — I can help you summarize, expand, refine, or understand it better. What would you like to know?",
            },
          ]);
        }
        toast.success("Conversation deleted!");
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Create conversation if needed
    let convId = currentConversationId;
    if (!convId) {
      const newConv = await createConversation(undefined, generateTitleFromMessage(trimmed));
      if (newConv) {
        convId = newConv.id;
        setCurrentConversationId(convId);
        setConversations([newConv, ...conversations]);
      } else {
        toast.error("Failed to create conversation");
        return;
      }
    }

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      // Save user message to database
      await addMessage(convId, "user", trimmed);

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

      // Save AI message to database
      if (convId) {
        await addMessage(convId, "ai", aiResponse);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = "Something went wrong while contacting AI.";
      setMessages((prev) => [...prev, { role: "ai", content: errorMsg }]);

      // Save error message to database
      if (convId) {
        await addMessage(convId, "ai", errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyNoteToClipboard = async () => {
    await navigator.clipboard.writeText(noteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.back()}
              className="gap-2 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border/50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border/50"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">History ({conversations.length})</span>
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
          <Button
            onClick={handleNewConversation}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </div>

      {/* Main Chat Area with History Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-64 border-r border-border/30 bg-card/50 backdrop-blur-sm overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Conversations</h3>
              {conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground">No conversations yet</p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      currentConversationId === conv.id
                        ? "bg-primary/20 border-primary/50"
                        : "bg-background/50 border-border/30 hover:bg-primary/10"
                    }`}
                    onClick={() => {
                      setCurrentConversationId(conv.id);
                      router.push(`/ask-ai?conversation=${conv.id}`);
                    }}
                  >
                    <div className="text-xs font-semibold text-foreground truncate mb-1">
                      {conv.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                      className="mt-2 w-full h-7 text-xs gap-1 bg-destructive/20 text-destructive hover:bg-destructive/30"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
      <main className="flex-1 flex flex-col mx-auto w-full max-w-4xl min-h-screen px-4 py-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-border/30">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground shadow-lg animate-float">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Ask AI</h1>
              <p className="text-muted-foreground mt-1">
                Summarize, expand, refine, or ask anything about your note
              </p>
            </div>
          </div>
        </div>

        {/* Note Preview Card */}
        {noteText && (
          <div className="mb-8 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-md hover:shadow-lg transition-all backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Note
                </span>
              </div>
              <Button
                onClick={copyNoteToClipboard}
                className="gap-2 h-8 px-3 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border/50 text-xs"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="max-h-40 overflow-auto text-sm leading-relaxed text-foreground whitespace-pre-wrap bg-background/30 rounded-lg p-4 border border-border/30 custom-scrollbar">
              {noteText}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {noteText && messages.length === 1 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Try asking...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Summarize this note",
                "What are the key points?",
                "Improve the writing",
                "Create action items",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(() => {
                      document.querySelector("input")?.focus();
                    }, 0);
                  }}
                  className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-sm text-foreground hover:border-primary/50 hover:shadow-md transition-all text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              style={{
                animation: `fadeIn 0.3s ease-out`,
              }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-6 py-4 text-sm leading-relaxed shadow-md transition-all backdrop-blur-sm ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-none"
                    : "bg-gradient-to-br from-card to-card/50 border border-border/50 text-foreground rounded-bl-none hover:shadow-lg"
                }`}
              >
                <div className="text-xs font-semibold mb-2 opacity-75 flex items-center gap-1">
                  {m.role === "ai" ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Assistant
                    </>
                  ) : (
                    <>👤 You</>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 px-6 py-4 text-sm text-muted-foreground flex items-center gap-3 shadow-md backdrop-blur-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
                  <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <span className="italic">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border/30 bg-gradient-to-t from-background/80 to-transparent pt-6">
          <div className="flex items-center gap-3">
            <input
              className="h-12 flex-1 rounded-xl border border-border/50 bg-card/50 px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all backdrop-blur-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your note... (Shift+Enter for newline)"
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
              disabled={loading || !input.trim()}
              className="h-12 px-6 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            💡 Tip: Be specific with your questions for better AI responses
          </p>
        </div>
        </main>
      </div>
    </div>
  );
}
