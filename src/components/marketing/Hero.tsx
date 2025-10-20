'use client';

import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="container mx-auto flex flex-col items-center gap-8 px-4 py-14 lg:flex-row lg:items-center lg:gap-12">
      {/* Left content */}
      <div className="w-full text-center lg:w-1/2 lg:text-left">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Organize your knowledge. Ask AI about any note.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Create notes, structure them into nodes, and chat with an AI that understands your context. Summaries, action items, and explanations are just one question away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <Link
            href="/signup"
            className="inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="inline-flex rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            Sign in
          </Link>
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          No credit card required. Switch between light and dark mode anytime.
        </div>
      </div>

      {/* Right image */}
      <div className="w-full lg:w-1/2">
        <Image
          src="https://www.creative-tim.com/twcomponents/svg/website-designer-bro-purple.svg"
          alt="AI-powered notes illustration"
          width={720}
          height={540}
          className="mx-auto h-auto w-full max-w-xl"
          priority
        />
      </div>
    </section>
  );
}
