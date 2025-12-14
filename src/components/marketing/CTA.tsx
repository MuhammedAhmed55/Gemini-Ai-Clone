"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary/5">
      <div className="mx-auto w-full max-w-4xl">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-10" />
          <div className="absolute inset-0 backdrop-blur-3xl" />

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                LIMITED TIME
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Ready to transform your note-taking?
            </h2>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already using our AI-powered platform to take smarter notes and organize their thoughts better.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-primary/50 text-primary font-semibold hover:bg-primary/5 transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Bottom text */}
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
