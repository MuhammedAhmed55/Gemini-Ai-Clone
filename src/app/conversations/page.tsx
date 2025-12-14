"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Trash2, Plus, Calendar, MessageSquare } from "lucide-react";
import { getConversations, deleteConversation, type Conversation } from "@/lib/conversations";
import { toast } from "sonner";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const convs = await getConversations();
        setConversations(convs);
      } catch (error) {
        console.error("Failed to load conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
  }, []);

  const handleDelete = async (convId: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const deleted = await deleteConversation(convId);
      if (deleted) {
        setConversations((prev) => prev.filter((c) => c.id !== convId));
        toast.success("Conversation deleted!");
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Top Navigation Bar */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            className="gap-2 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border/50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Conversation History</h2>
          <Button
            onClick={() => router.push("/ask-ai")}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </div>

      <div className="p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Conversation History
              </h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <MessageCircle size={16} />
                View and manage all your AI conversations
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="space-y-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse mx-auto" />
                <p className="text-muted-foreground">Loading conversations...</p>
              </div>
            </div>
          ) : conversations.length === 0 ? (
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 p-12 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No conversations yet</h2>
              <p className="text-muted-foreground mb-6">
                Start a new chat with AI to begin your journey
              </p>
              <Button
                onClick={() => router.push("/ask-ai")}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Start New Conversation
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversations.map((conv) => (
                <Card
                  key={conv.id}
                  className="border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                  onClick={() => router.push(`/ask-ai?conversation=${conv.id}`)}
                >
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {conv.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">
                        {new Date(conv.updated_at).toLocaleTimeString()}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conv.id);
                        }}
                        className="h-8 px-3 text-xs gap-1 bg-destructive/20 text-destructive hover:bg-destructive/30"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
