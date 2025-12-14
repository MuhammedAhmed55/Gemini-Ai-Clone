'use client';

import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="container mx-auto flex flex-col items-center gap-8 px-4 py-20 lg:flex-row lg:items-center lg:gap-16">
      {/* Left content */}
      <div className="w-full text-center lg:w-1/2 lg:text-left">
        <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary border border-primary/20">
          ✨ AI-Powered Note Taking
        </div>
        <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
          Organize Your Ideas.
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Let AI Help.</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-xl">
          Create notes, structure them into nodes, and chat with an AI that understands your context. Get summaries, action items, and explanations instantly.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
          <Link
            href="/signup"
            className="inline-flex rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all"
          >
            Get Started Free →
          </Link>
          <Link
            href="/login"
            className="inline-flex rounded-lg border-2 border-primary/20 px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-primary/5 transition-all"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent"></div>
            Free forever plan
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary/60"></div>
            Full dark mode
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="w-full lg:w-1/2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
          <Image
            src="https://www.creative-tim.com/twcomponents/svg/website-designer-bro-purple.svg"
            alt="AI-powered notes illustration"
            width={720}
            height={540}
            className="relative mx-auto h-auto w-full max-w-xl drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
