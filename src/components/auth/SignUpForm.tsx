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

export default function SignUpForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      // Step 1: Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }, // optional user metadata
        },
      });
  
      if (error) throw error;
  
      // Step 2: Get the user ID from the response
      const userId = data.user?.id;
  
      // Step 3: Insert user data into your custom `users` table
      if (userId) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: userId, // same as auth.users id (foreign key)
            name,
            email,
          },
        ]);
  
        if (insertError) throw insertError;
      }
  
      // Step 4: Notify and redirect
      toast.success("Verification email sent. Please check your inbox.");
      router.push("/check-email");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign up"
      toast.error(errorMessage)
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" })
      if (error) throw error
      // Redirect happens via OAuth flow
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
          <CardTitle className="text-3xl font-bold text-foreground">Create Account</CardTitle>
          <CardDescription className="text-base text-muted-foreground">Join GoatNote and start organizing your ideas</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-base font-semibold">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-lg border-border/50"
                required
              />
            </div>
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
              <Label htmlFor="password" className="text-base font-semibold">Password</Label>
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
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/30 py-6">
          <Button variant="outline" className="h-11 w-full border-border/50 hover:bg-muted rounded-lg font-semibold" onClick={handleGoogle} disabled={loading}>
            🔐 Continue with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
  }

