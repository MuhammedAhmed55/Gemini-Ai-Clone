"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/auth/client"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  useEffect(() => {
    // Check if user has a valid session (recovery session from reset link)
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        setSessionError(true)
      }
    }

    checkSession()
  }, [supabase.auth])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        setLoading(false)
        return
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      toast.success("Password updated successfully")
      router.push("/login")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Card className="border border-border/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border/50 px-6 py-6">
            <CardTitle className="text-3xl font-bold text-foreground">Link Expired</CardTitle>
            <CardDescription className="text-base text-muted-foreground">Password reset link is invalid or expired</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                This password reset link has expired or is invalid. Password reset links are only valid for 1 hour.
              </p>
              <p className="text-sm text-muted-foreground">
                Please request a new password reset link.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/30 py-6">
            <Button asChild className="h-11 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg">
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 w-full border-border/50 hover:bg-muted rounded-lg font-semibold">
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <Card className="border border-border/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border/50 px-6 py-6">
          <CardTitle className="text-3xl font-bold text-foreground">Reset Password</CardTitle>
          <CardDescription className="text-base text-muted-foreground">Enter your new password</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="password" className="text-base font-semibold">New Password</Label>
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
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword" className="text-base font-semibold">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-lg border-border/50"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="h-11 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all mt-2" 
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/30 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
    </div>
  )
}
