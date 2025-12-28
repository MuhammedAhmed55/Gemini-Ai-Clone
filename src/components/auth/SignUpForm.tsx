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
  

  // const handleGoogle = async () => {
  //   setError(null)
  //   setLoading(true)
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({ 
  //       provider: "google",
  //       options: {
  //         redirectTo: `${window.location.origin}/dashboard`,
  //       },
  //     })
  //     if (error) throw error
  //   } catch (err: unknown) {
  //     const errorMessage = err instanceof Error ? err.message : "Google sign-up failed"
  //     toast.error(errorMessage)
  //     setLoading(false)
  //   }
  // }
  return (
    <div className="w-full max-w-md">
      <Card className="border border-border/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border/50 px-6 py-6">
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30"></div>
              </div>
              {/* <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
              </div> */}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/30 py-6">
          {/* <Button variant="outline" className="h-11 w-full border-border/50 hover:bg-muted rounded-lg font-semibold transition-colors" onClick={handleGoogle} disabled={loading}>
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Creating account..." : "Continue with Google"}
          </Button> */}
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

