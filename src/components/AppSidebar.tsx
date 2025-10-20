import { getUser } from "@/auth/server"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link"
import SidebarGroupContent from "./SidebarGroupContent"
import { createClient } from "@/auth/server" // using your existing helper

async function AppSidebar() {
  const user = await getUser()
  const supabase = await createClient()

  let notes: any[] = []

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
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
              "Your Notes"
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>{" "}
                to see your notes
              </p>
            )}
          </SidebarGroupLabel>

          {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
