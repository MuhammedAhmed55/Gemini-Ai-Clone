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

// ZOD + React Hook Form imports
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// ---------------- Form Schema ----------------
const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be 6+ characters"),
})

type SignUpType = z.infer<typeof signupSchema>

export default function SignUpForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  })

  // ---------------- SUBMIT ----------------
  const onSubmit = async (data: SignUpType) => {
    setLoading(true)

    try {
      // Step 1 → Signup
      const signUpResult = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name }, // metadata
        },
      })
      if (signUpResult.error) throw signUpResult.error

      const userId = signUpResult.data?.user?.id

      // Step 2 → Insert user into DB
      if (userId) {
        const { error: insertError } = await supabase.from("users").insert([
          { id: userId, name: data.name, email: data.email },
        ])
        if (insertError) throw insertError
      }

      // Step 3 → Redirect
      toast.success("Account created! Check your email for verification.")
      router.push("/check-email")

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // ---------------- UI ----------------
  return (
    <div className="w-full max-w-md">
      <Card className="border border-border/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border/50 px-6 py-6">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Join GoatNote and start organizing your ideas
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>

            {/* Name */}
            <div className="grid gap-2">
              <Label className="font-semibold">Full Name</Label>
              <Input
                placeholder="John Doe"
                {...register("name")}
                className="h-11 rounded-lg border-border/50"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label className="font-semibold">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="h-11 rounded-lg border-border/50"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label className="font-semibold">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-11 rounded-lg border-border/50"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-primary hover:bg-primary/90 font-semibold rounded-lg mt-2"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4 border-t py-6 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
