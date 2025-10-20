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
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to sign up");
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
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed")
      setLoading(false)
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Join GoatNote. It only takes a minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
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
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          Continue with Google
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

  