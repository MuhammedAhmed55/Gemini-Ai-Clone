"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/auth/client"
import { toast } from "sonner"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success("Logged in successfully")
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" })
      if (error) throw error
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed")
      setLoading(false)
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Welcome back! Enter your credentials to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Using toasts for feedback; no inline error display */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          Continue with Google
        </Button>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

