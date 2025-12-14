"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/auth/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const supabase = createClient();

type Note = {
  id: string;
  text: string;
  author_id: string;
  created_at?: string | null;
  updated_at?: string | null;
};

function formatLocal(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function getTitleAndSnippet(text: string) {
  const lines = (text || "").split(/\r?\n/);
  const title = (lines.find((l) => l.trim().length > 0) || "Untitled").slice(0, 60);
  const snippet = text.replace(/\s+/g, " ").slice(0, 100);
  return { title, snippet };
}

export default function SidebarGroupContent({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("note");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => n.text?.toLowerCase().includes(q));
  }, [notes, query]);

  // 🗑️ Delete Note
  const handleDelete = async (noteId: string) => {
    try {
      setLoadingId(noteId);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.warning("You must be signed in to delete notes.");
        return;
      }

      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("author_id", user.id);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete note. Please try again.");
      } else {
        toast.success("Note deleted successfully.");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting the note.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col justify-between">
      {/* 🔹 Top Section: Search + Notes List */}
      <div className="flex flex-col gap-3">
        <div className="px-2 py-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your notes..."
            className="h-9 rounded-lg border-border/50 bg-background/50"
          />
        </div>

        <div className="custom-scrollbar flex-1 space-y-2 overflow-auto px-2">
          {filtered.length === 0 && (
            <div className="px-2 py-4 text-center text-xs text-muted-foreground">
              No notes found
            </div>
          )}

          {filtered.map((n) => {
            const { title, snippet } = getTitleAndSnippet(n.text);
            return (
              <div
                key={n.id}
                className={`group flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all ${
                  activeId === n.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border/30 hover:bg-muted/50 hover:border-primary/30"
                }`}
              >
                {/* Note content */}
                <button
                  type="button"
                  className="flex-1 text-left"
                  title={title}
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("note", n.id);
                    router.push(url.pathname + "?" + url.searchParams.toString());
                  }}
                >
                  <div className="line-clamp-1 text-xs font-semibold text-foreground">{title}</div>
                  <div className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                    {snippet}
                  </div>
                </button>

                {/* 🗑️ Delete Icon */}
                <Trash2
                  size={16}
                  className={`ml-2 flex-shrink-0 cursor-pointer transition ${
                    loadingId === n.id
                      ? "text-muted-foreground/40 animate-pulse"
                      : "text-muted-foreground hover:text-destructive"
                  }`}
                  onClick={() => handleDelete(n.id)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔹 Bottom Section: Manage Notes Button */}
      <div className="mt-4 border-t border-border/30 pt-3 px-2">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm h-9">
          <Link href="/manage">Manage All Notes</Link>
        </Button>
      </div>
    </div>
  );
}
