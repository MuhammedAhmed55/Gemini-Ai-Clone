"use client"
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, NotebookPen, Stars, Sparkles } from "lucide-react";

const features = [
  {
    title: "Ask about notes",
    description: "Chat with your content. Get summaries, insights and action items.",
    icon: MessageSquare,
  },
  {
    title: "Fast capture",
    description: "Start a note quickly and refine later with AI assistance.",
    icon: NotebookPen,
  },
  {
    title: "Smart summaries",
    description: "Turn long text into clear takeaways and next steps.",
    icon: Stars,
  },
  {
    title: "Lightweight & modern",
    description: "Clean UI with dark mode and responsive design.",
    icon: Sparkles,
  },
] as const;

export default function FeatureCards() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <Card key={idx} className="border-border/60">
              <CardContent className="flex h-full flex-col gap-2 p-5">
                <div className="inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold leading-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
