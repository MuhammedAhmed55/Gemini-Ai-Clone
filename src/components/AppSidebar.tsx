import { getUser } from "@/auth/server"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link"
import SidebarGroupContent from "./SidebarGroupContent"
import { createClient } from "@/auth/server"
import { FileText, Plus } from "lucide-react"

async function AppSidebar() {
  const user = await getUser()
  const supabase = await createClient()

  type Note = { id: string; text: string; created_at: string; updated_at: string; author_id: string };
  let notes: Note[] = []

  if (user) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) console.error("Error fetching notes:", error)
    else notes = data || []
  }

  return (
    <Sidebar className="border-r border-border/30 bg-gradient-to-b from-card via-card to-card/50">
      <SidebarContent className="custom-scrollbar">
        {/* Premium Header */}
        <div className="px-4 py-6 mb-2">
          <div className="rounded-xl bg-gradient-to-br from-primary/15 via-accent/10 to-primary/10 border border-primary/20 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">AI Notes</div>
                <div className="text-xs text-muted-foreground">Smart organization</div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-primary/30 to-accent/30 rounded-full" />
          </div>
        </div>

        <SidebarGroup className="space-y-0">
          {/* Your Notes Header */}
          <div className="px-4 py-3 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                <SidebarGroupLabel className="text-sm font-bold text-foreground p-0 m-0">
                  {user ? "Your Notes" : "Notes"}
                </SidebarGroupLabel>
              </div>
              {user && notes.length > 0 && (
                <div className="px-2 py-1 bg-primary/20 rounded-md border border-primary/30">
                  <span className="text-xs font-semibold text-primary">{notes.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* User Auth Info */}
          {!user ? (
            <div className="px-4 py-4 bg-accent/10 rounded-lg border border-accent/20 mx-2 mb-2">
              <p className="text-xs text-muted-foreground mb-3">
                Sign in to access your notes
              </p>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all"
              >
                <Plus className="h-4 w-4" />
                Sign In
              </Link>
            </div>
          ) : (
            <SidebarGroupContent notes={notes} />
          )}
        </SidebarGroup>

        {/* Footer Info */}
        {user && (
          <div className="mt-auto pt-4 px-4 border-t border-border/30">
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                <span>Total Notes</span>
                <span className="font-bold text-foreground">{notes.length}</span>
              </div>
              <div className="text-center text-xs text-muted-foreground pt-2">
                💡 Tip: Use Ask AI to get suggestions!
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
