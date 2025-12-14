"use client";

// Import React hooks for state management and side effects
import { useEffect, useState, Suspense } from "react";
// Import reusable Button component from shadcn/ui
import { Button } from "@/components/ui/button";
// Import Supabase client for database operations (auth & data queries)
import { createClient } from "@/auth/client";
// Import toast notifications for user feedback (success, error, info messages)
import { toast } from "sonner";
// Import icons from lucide-react library for UI elements
import { MessageCircle, PlusCircle, Save, BarChart3, Lightbulb, Clock, Copy, Check } from "lucide-react";
// Import Next.js navigation hooks to handle routing and URL parameters
import { useRouter, useSearchParams } from "next/navigation";

// Wrapper component to handle useSearchParams
function DashboardContent() {
  // Initialize Supabase client for database/auth operations
  const supabase = createClient();
  // Initialize Next.js router for client-side navigation
  const router = useRouter();
  // Get URL search parameters (query string) from current URL
  const searchParams = useSearchParams();
  // Extract the 'note' ID from URL parameters (e.g., ?note=abc123)
  const noteParam = searchParams.get("note");

  // ========== STATE MANAGEMENT ==========
  // Stores the unique identifier of the current note being edited
  const [noteId, setNoteId] = useState<string | null>(null);
  // Stores the actual text content of the note
  const [note, setNote] = useState<string>("");
  // Tracks whether the note is currently being saved to database
  const [isSaving, setIsSaving] = useState(false);
  // Stores the current logged-in user's unique ID (from Supabase auth)
  const [userId, setUserId] = useState<string | null>(null);
  // Tracks whether the copy-to-clipboard button was just clicked
  const [copied, setCopied] = useState(false);

  // ========== EFFECT: GET CURRENT USER ==========
  // Runs once when component mounts to get authenticated user
  // This is essential before we can load user-specific notes from database
  useEffect(() => {
    (async () => {
      // Query Supabase to get the currently logged-in user's data
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        toast.error("Failed to fetch user. Please log in.");
        return;
      }
      // Store the user ID in state so we can use it in other queries
      setUserId(data.user?.id ?? null);
    })();
  }, []);

  // ========== EFFECT: LOAD NOTE FROM DATABASE ==========
  // Runs when noteParam or userId changes
  // Fetches the specific note from database if a note ID is in the URL
  useEffect(() => {
    const load = async () => {
      // Don't fetch if we don't have a note ID in URL or user isn't logged in
      if (!noteParam || !userId) return;
      try {
        // Query the 'notes' table in Supabase to get note details
        // We select only the fields we need: id, text, created_at, updated_at
        // Filter by note ID AND ensure it belongs to the current user (security)
        const { data, error } = await supabase
          .from("notes")
          .select("id, text, created_at, updated_at")
          .eq("id", noteParam)
          .eq("author_id", userId)
          .single();
        if (error) throw error;
        // Store the note ID and content in state so user can edit it
        setNoteId(data.id);
        setNote(data.text || "");
      } catch (e: unknown) {
        console.error(e);
        toast.error("Could not load the selected note.");
      }
    };
    load();
  }, [noteParam, userId]);

  // ========== FUNCTION: CREATE NEW NOTE ==========
  // Called when user clicks "New Note" button
  // Clears current note and resets URL to start fresh
  const onNewNote = () => {
    // If note has content, ask user for confirmation before clearing
    if (note) {
      const confirmClear = window.confirm(
        "Start a new note? Current content will be cleared."
      );
      if (!confirmClear) return;
    }
    // Clear the note content and ID to start fresh
    setNote("");
    setNoteId(null);
    // Remove the 'note' parameter from URL to indicate new note
    const url = new URL(window.location.href);
    url.searchParams.delete("note");
    router.replace(
      url.pathname + (url.searchParams.toString() ? "?" + url.searchParams.toString() : "")
    );
  };

  // ========== FUNCTION: SAVE NOTE TO DATABASE ==========
  // Called when user clicks "Save Note" button
  // Handles both creating new notes and updating existing ones
  const onSave = async () => {
    // Trim whitespace and validate note has content
    const content = note.trim();
    if (!content) {
      toast.info("Write something before saving.");
      return;
    }
    // Make sure user is logged in before attempting to save
    if (!userId) {
      toast.error("You must be logged in to save notes.");
      return;
    }
    try {
      setIsSaving(true);
      
      if (noteId) {
        // ===== UPDATE EXISTING NOTE =====
        // If noteId exists, we're updating an existing note in the database
        // Use .update() with filters to ensure we only update the user's own note
        const { error } = await supabase
          .from("notes")
          .update({ text: content, updated_at: new Date().toISOString() })
          .eq("id", noteId)
          .eq("author_id", userId);
        if (error) throw error;
        toast.success("Note updated.");
      } else {
        // ===== CREATE NEW NOTE =====
        // If no noteId exists, insert a new row into the notes table
        // Set the note author_id to current user and text to note content
        const { data, error } = await supabase
          .from("notes")
          .insert({ text: content, author_id: userId })
          .select("id")
          .single();
        if (error) throw error;
        // Store the newly created note's ID in state
        setNoteId(data.id);
        // Update URL to include the new note ID so it can be reloaded
        const url = new URL(window.location.href);
        url.searchParams.set("note", data.id);
        router.replace(url.pathname + "?" + url.searchParams.toString());
        toast.success("Note saved.");
        router.refresh();
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to save note.";
      console.error(e);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // ========== FUNCTION: COPY NOTE TO CLIPBOARD ==========
  // Called when user clicks "Copy" button
  // Copies the note content to user's clipboard for easy sharing
  const copyToClipboard = async () => {
    // Use browser's Clipboard API to copy note text
    await navigator.clipboard.writeText(note);
    // Show visual feedback by changing button to show checkmark
    setCopied(true);
    toast.success("Copied to clipboard!");
    // Revert button back to copy icon after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  // ========== CALCULATE NOTE STATISTICS ==========
  // Count total words in the note (splits by whitespace and filters empty strings)
  const wordCount = note.split(/\s+/).filter(w => w).length;
  // Estimate reading time: average reading speed is ~200 words per minute
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* ========== HEADER SECTION ========== */}
        {/* Title, description, and "Manage All" navigation button */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                My Notes
              </h1>
              <p className="text-lg text-muted-foreground">
                Create, organize, and ask AI about your notes
              </p>
            </div>
            <Button
              onClick={() => router.push("/manage")}
              className="gap-2 bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30"
            >
              <BarChart3 className="size-5" />
              <span className="hidden sm:inline">Manage All</span>
            </Button>
          </div>

          {/* ========== ACTION BUTTONS SECTION ========== */}
          {/* Primary buttons: New Note, Ask AI, Copy to Clipboard */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={onNewNote}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 px-6 py-2 h-auto shadow-lg hover:shadow-xl transition-all"
            >
              <PlusCircle className="size-5" /> New Note
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/ask-ai?note=${encodeURIComponent(note)}`)}
              className="border-2 border-accent/50 text-accent hover:bg-accent/10 font-semibold gap-2 px-6 py-2 h-auto transition-all"
            >
              <MessageCircle className="size-5" /> Ask AI
            </Button>
            {note && (
              <Button
                type="button"
                onClick={copyToClipboard}
                className="gap-2 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border/50"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                Copy
              </Button>
            )}
          </div>
        </div>

        {/* ========== MAIN EDITOR CARD ========== */}
        {/* Large textarea where user writes and edits notes */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg overflow-hidden transition-all hover:shadow-xl backdrop-blur-sm">
          {/* Header with Note ID and Reading Time Stats */}
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-b border-border/50 px-6 py-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              {noteId ? `Note ID: ${noteId.slice(0, 8)}...` : "Create a new note"}
            </p>
            {note && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {readingTime} min read
                </span>
              </div>
            )}
          </div>

          {/* Text input area where user types the note content */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here... Share your thoughts, ideas, and everything on your mind. Let AI help you organize and understand your thoughts better!"
            className="min-h-[550px] w-full resize-none bg-transparent p-8 text-base text-foreground placeholder:text-muted-foreground/60 outline-none font-medium leading-relaxed focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* ========== FOOTER ACTION SECTION ========== */}
        {/* Grid with stats on left, save and manage buttons on right */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ========== STATS SECTION ========== */}
          {/* Display reading statistics about the note (character count, word count, reading time) */}
          <div className="rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border border-border/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Characters</span>
              <span className="font-bold text-foreground text-lg">{note.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Words</span>
              <span className="font-bold text-foreground text-lg">{wordCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reading Time</span>
              <span className="font-bold text-foreground text-lg">{readingTime} min</span>
            </div>
          </div>

          {/* ========== ACTION BUTTONS SECTION ========== */}
          {/* Primary "Save Note" button and secondary "View All Notes" button */}
          <div className="flex flex-col gap-3">
            {/* Main save button - disabled if no content or already saving */}
            <Button
              type="button"
              onClick={onSave}
              disabled={isSaving || !note.trim()}
              className="w-full h-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 px-8 py-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="size-5" />
              {isSaving ? "Saving..." : "Save Note"}
            </Button>
            {/* Secondary button to navigate to manage page to view all notes */}
            <Button
              type="button"
              onClick={() => router.push("/manage")}
              className="w-full h-auto gap-2 bg-foreground/10 hover:bg-foreground/20 text-foreground border border-border/50"
            >
              <BarChart3 className="size-4" />
              View All Notes
            </Button>
          </div>
        </div>

        {/* ========== PRO TIP BANNER ========== */}
        {/* Helpful information banner educating user about AI features */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/20 p-6 backdrop-blur-sm">
          <div className="flex gap-3">
            <Lightbulb className="size-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-1">AI-Powered Tips</p>
              <p className="text-sm text-muted-foreground">
                Use the &quot;Ask AI&quot; button to get summaries, action items, refinements, and more about your notes. Our AI learns from your writing style!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DashboardContent />
    </Suspense>
  );
}
