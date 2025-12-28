"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMemo, useState, type FormEvent } from "react"
import { createClient } from "@/auth/client"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSubmitted(true)
      toast.success("Password reset link sent to your email")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Card className="border border-border/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border/50 px-6 py-6">
            <CardTitle className="text-3xl font-bold text-foreground">Check Your Email</CardTitle>
            <CardDescription className="text-base text-muted-foreground">Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Check your email and click the link to reset your password. The link will expire in 1 hour.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/30 py-6">
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
          <CardTitle className="text-3xl font-bold text-foreground">Forgot Password?</CardTitle>
          <CardDescription className="text-base text-muted-foreground">Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
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
            <Button 
              type="submit" 
              className="h-11 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all mt-2" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
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
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
      </div>
    
  )
}
