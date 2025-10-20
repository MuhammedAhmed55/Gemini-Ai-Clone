"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/auth/client"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onLogout = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success("Logged out successfully")
      // Navigate back to landing and refresh to update server components (Header)
      router.push("/")
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to log out")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={onLogout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </Button>
  )
}
