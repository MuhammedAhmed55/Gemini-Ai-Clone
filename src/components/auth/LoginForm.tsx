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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in"
      toast.error(errorMessage)
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Google sign-in failed"
      toast.error(errorMessage)
      setLoading(false)
    }
  }
  return (
    <div className="w-full max-w-md">
      <Card className="border border-border/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border/50">
          <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-base text-muted-foreground">Sign in to your GoatNote account</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-base font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg border-border/50"
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-semibold">Password</Label>
                <Link href="#" className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border-border/50"
                required
              />
            </div>
            <Button type="submit" className="h-11 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/30 py-6">
          <Button variant="outline" className="h-11 w-full border-border/50 hover:bg-muted rounded-lg font-semibold" onClick={handleGoogle} disabled={loading}>
            🔐 Continue with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

