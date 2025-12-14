"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Loader2,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

type Note = {
  id: string;
  text: string;
  created_at: string;
  updated_at: string;
  author_id: string;
};

export default function ManageNotesTable() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  // 🧩 State for Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editText, setEditText] = useState("");

  // ✅ Fetch Notes from Supabase
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          toast.error("Please sign in to view your notes.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          toast.error("Failed to fetch notes.");
          console.error(error);
        } else {
          setNotes(data || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Unexpected error fetching notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // ✅ Delete Note
  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) {
        toast.error("Failed to delete note.");
        console.error(error);
      } else {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        toast.success("Note deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error deleting note.");
    }
  };

  // ✅ Open Edit Modal
  const handleEditClick = (note: Note) => {
    setSelectedNote(note);
    setEditText(note.text);
    setEditModalOpen(true);
  };

  // ✅ Update Note in Supabase
  const handleUpdate = async () => {
    if (!selectedNote) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("notes")
        .update({ text: editText, updated_at: new Date().toISOString() })
        .eq("id", selectedNote.id);

      if (error) {
        toast.error("Failed to update note.");
        console.error(error);
      } else {
        toast.success("Note updated successfully!");
        setNotes((prev) =>
          prev.map((n) =>
            n.id === selectedNote.id ? { ...n, text: editText } : n
          )
        );
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error updating note.");
    }
  };

  // 🔍 Search Filter
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🧭 Pagination Logic
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotes = filteredNotes.slice(startIndex, endIndex);

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
          <h2 className="text-lg font-semibold text-foreground">Notes Manager</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Notes Manager
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <FileText size={16} />
                  Manage and organize your saved notes
                </p>
              </div>
              <Button 
                onClick={() => router.push("/dashboard")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Plus size={18} className="mr-2" />
                Create Note
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/50"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 h-12 bg-card/50 border-border/50 shadow-sm focus:shadow-md transition-shadow rounded-xl"
              />
            </div>
          </div>

          {/* Table Card */}
          <Card className="shadow-xl border-border/50 overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-2xl">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-6 w-6 text-muted-foreground/50 animate-spin" />
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5 border-b border-border/50">
                    <th className="px-4 py-4 text-left text-sm font-bold text-foreground/80 w-[80px]">
                      #
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-foreground/80">
                      Note
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-foreground/80">
                      Created
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-bold text-foreground/80">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentNotes.length > 0 ? (
                    currentNotes.map((note, index) => (
                      <tr
                        key={note.id}
                        className="border-b border-border/30 hover:bg-primary/5 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground truncate max-w-[300px]">
                          {note.text}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>
                              {new Date(note.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(note)}
                              className="hover:bg-primary/10 text-primary"
                            >
                              <Edit size={14} className="mr-1.5" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(note.id)}
                              className="hover:bg-destructive/10 text-destructive"
                            >
                              <Trash2 size={14} className="mr-1.5" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText
                            size={48}
                            className="text-muted-foreground/30"
                          />
                          <p className="text-muted-foreground font-medium">
                            No notes found
                          </p>
                          <p className="text-sm text-muted-foreground/70">
                            Try adjusting your search criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}

            {/* Pagination */}
            {!loading && filteredNotes.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(endIndex, filteredNotes.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">
                  {filteredNotes.length}
                </span>{" "}
                notes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="border-border/50 hover:bg-foreground/5"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border-border/50 hover:bg-foreground/5"
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(totalPages, prev + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="border-border/50 hover:bg-foreground/5"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
            )}
          </Card>
        </div>
      </div>

      {/* ✏️ Edit Modal - Premium Design */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm max-w-2xl p-0 overflow-hidden shadow-2xl">
          {/* Modal Header with Gradient */}
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-b border-border/50 px-6 py-6">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <Edit size={20} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-foreground">Edit Note</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">Make changes and save your updates</p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Character Count Info */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-border/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Character Count</span>
              <span className="text-sm font-bold text-foreground">{editText.length}</span>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>Note Content</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Required</span>
              </label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Update your note text here... Share your thoughts, ideas, and everything on your mind."
                className="w-full min-h-[250px] p-4 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none transition-all overflow-y-auto custom-scrollbar"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-border/30">
                <div className="text-xs text-muted-foreground font-medium mb-1">Words</div>
                <div className="text-lg font-bold text-foreground">{editText.split(/\s+/).filter(w => w).length}</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-border/30">
                <div className="text-xs text-muted-foreground font-medium mb-1">Lines</div>
                <div className="text-lg font-bold text-foreground">{editText.split('\n').length}</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-border/30">
                <div className="text-xs text-muted-foreground font-medium mb-1">Reading Time</div>
                <div className="text-lg font-bold text-foreground">{Math.ceil(editText.split(/\s+/).filter(w => w).length / 200)}m</div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Press Ctrl+S to save changes</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="border-border/50 hover:bg-foreground/5 text-foreground gap-2"
              >
                <X size={16} /> Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground font-semibold gap-2 transition-all"
              >
                <Save size={16} /> Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
