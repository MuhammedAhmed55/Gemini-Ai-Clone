"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

type Note = {
  id: string;
  text: string;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("note");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => n.text?.toLowerCase().includes(q));
  }, [notes, query]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 px-2">
      <div className="px-1 py-1.5">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          className="h-9"
        />
      </div>

      <div className="custom-scrollbar flex-1 space-y-1 overflow-auto pr-1">
        {filtered.length === 0 && (
          <div className="px-2 py-2 text-sm text-muted-foreground">No notes found</div>
        )}

        {filtered.map((n) => {
          const { title, snippet } = getTitleAndSnippet(n.text);
          return (
            <button
              key={n.id}
              type="button"
              className={`group w-full rounded-md border px-2 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                activeId === n.id
                  ? "border-primary bg-accent/60"
                  : "border-transparent hover:bg-accent hover:text-accent-foreground"
              }`}
              title={title}
              onClick={() => {
                // Navigate by setting the query param ?note=<id>
                const url = new URL(window.location.href);
                url.searchParams.set("note", n.id);
                router.push(url.pathname + "?" + url.searchParams.toString());
              }}
            >
              <div className="line-clamp-1 text-sm font-medium">{title}</div>
              <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{snippet}</div>
              <div className="mt-1 space-y-0.5 text-[10px] text-muted-foreground">
                <div>Created: {formatLocal(n.created_at)}</div>
                {n.updated_at && n.updated_at !== n.created_at && (
                  <div>Edited: {formatLocal(n.updated_at)}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}