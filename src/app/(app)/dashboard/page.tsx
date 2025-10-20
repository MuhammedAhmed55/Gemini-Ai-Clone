"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import AskAIModal from "@/components/AskAIModal";
import { createClient } from "@/auth/client";
import { toast } from "sonner";
import { MessageCircle, PlusCircle, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NotesPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteParam = searchParams.get("note");

  const [noteId, setNoteId] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user on mount
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        toast.error("Failed to fetch user. Please log in.");
        return;
      }
      setUserId(data.user?.id ?? null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load selected note when ?note=<id> changes and when user is known
  useEffect(() => {
    const load = async () => {
      if (!noteParam || !userId) return;
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("id, text, created_at, updated_at")
          .eq("id", noteParam)
          .eq("author_id", userId)
          .single();
        if (error) throw error;
        setNoteId(data.id);
        setNote(data.text || "");
      } catch (e: any) {
        console.error(e);
        toast.error("Could not load the selected note.");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteParam, userId]);

  const onNewNote = () => {
    if (note) {
      const confirmClear = window.confirm(
        "Start a new note? Current content will be cleared."
      );
      if (!confirmClear) return;
    }
    setNote("");
    setNoteId(null);
    // Remove note param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("note");
    router.replace(
      url.pathname + (url.searchParams.toString() ? "?" + url.searchParams.toString() : "")
    );
  };

  const onSave = async () => {
    const content = note.trim();
    if (!content) {
      toast.info("Write something before saving.");
      return;
    }
    if (!userId) {
      toast.error("You must be logged in to save notes.");
      return;
    }
    try {
      setIsSaving(true);
      if (noteId) {
        const { error } = await supabase
          .from("notes")
          .update({ text: content, updated_at: new Date().toISOString() })
          .eq("id", noteId)
          .eq("author_id", userId);
        if (error) throw error;
        toast.success("Note updated.");
      } else {
        const { data, error } = await supabase
          .from("notes")
          .insert({ text: content, author_id: userId })
          .select("id")
          .single();
        if (error) throw error;
        setNoteId(data.id);
        // Add note param to URL
        const url = new URL(window.location.href);
        url.searchParams.set("note", data.id);
        router.replace(url.pathname + "?" + url.searchParams.toString());
        toast.success("Note saved.");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setAskOpen(true)}
          title="Ask AI about this note"
        >
          <MessageCircle className="size-4" /> Ask AI
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onNewNote}
          title="Start a new note"
        >
          <PlusCircle className="size-4" /> New Note
        </Button>
      </div>

      <div className="rounded-md border bg-background">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note here..."
          className="min-h-[320px] w-full resize-y rounded-md bg-transparent p-4 outline-none"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="button" onClick={onSave} disabled={isSaving}>
          <Save className="size-4" /> {isSaving ? "Saving..." : "Save Note"}
        </Button>
      </div>

      <AskAIModal open={askOpen} onOpenChange={setAskOpen} noteText={note} />
    </div>
  );
}
