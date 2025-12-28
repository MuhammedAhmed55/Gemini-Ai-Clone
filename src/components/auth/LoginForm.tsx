"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClient } from "@/auth/client"
import { toast } from "sonner"
import { useMemo, useState } from "react"

// ZOD + React Hook Form Imports
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// ---------------- Schema ----------------
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormType = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  // ---------------- Submit Handler ----------------
  const onSubmit = async (data: LoginFormType) => {
    setLoading(true)
    try {
      const result = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (result.error) throw result.error
      toast.success("Logged in successfully")
      router.push("/dashboard")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card className="border border-border/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border/50 px-6 py-6">
          <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-base text-muted-foreground">Sign in to your GoatNote account</CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-base font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="h-11 rounded-lg border-border/50"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-semibold">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-11 rounded-lg border-border/50"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/30 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
