"use client";

import React from "react";
import { Zap, Users, Award, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "10K+",
    label: "Active Users",
    color: "from-primary/20 to-primary/10",
  },
  {
    icon: TrendingUp,
    number: "500K+",
    label: "Notes Created",
    color: "from-accent/20 to-accent/10",
  },
  {
    icon: Zap,
    number: "99.9%",
    label: "Uptime",
    color: "from-secondary/20 to-secondary/10",
  },
  {
    icon: Award,
    number: "4.9/5",
    label: "Average Rating",
    color: "from-destructive/20 to-destructive/10",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    content:
      "This AI note assistant has completely transformed how I organize my work. It saves me hours every week!",
    avatar: "👩‍💼",
  },
  {
    name: "Alex Chen",
    role: "Student",
    content:
      "Finally a note-taking app that actually understands me. The AI suggestions are incredibly helpful for my studies.",
    avatar: "👨‍🎓",
  },
  {
    name: "Emma Davis",
    role: "Content Creator",
    content:
      "The ability to ask the AI about my notes is genius. It's like having a personal assistant for all my ideas.",
    avatar: "👩‍💻",
  },
];

export default function StatsAndTestimonials() {
  return (
    <>
      {/* Stats Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/5">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl p-6 sm:p-8 bg-gradient-to-br border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--color-${
                      stat.color.split("/")[0].split("-")[1]
                    }) 0%, var(--color-${stat.color.split("/")[1]}) 100%)`,
                  }}
                >
                  <div className="relative z-10">
                    <Icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="mx-auto w-full max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm font-semibold text-accent">
                TESTIMONIALS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Loved by{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                thousands
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community and see why users love our AI-powered platform
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 sm:p-8 hover:border-accent/50 transition-all hover:shadow-lg group"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>

                {/* Content */}
                <p className="text-base text-foreground mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
