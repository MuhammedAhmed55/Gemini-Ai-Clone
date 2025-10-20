"use client";

import {
  FileText,
  ListTodo,
  Wand2,
  HelpCircle,
  BookOpen,
  Edit3,
  Mails,
  Layers,
  CircleAlert,
  ListOrdered,
} from "lucide-react";

type CardItem = {
  title: string;
  desc: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const cards: CardItem[] = [
  { title: "Summarize notes", desc: "Turn long notes into clear briefs.", Icon: FileText },
  { title: "Key takeaways", desc: "Highlight the most important points.", Icon: ListOrdered },
  { title: "Action items", desc: "Generate next steps from any note.", Icon: ListTodo },
  { title: "Explain concept", desc: "Clarify topics in simple language.", Icon: HelpCircle },
  { title: "Study outline", desc: "Create structured learning guides.", Icon: BookOpen },
  { title: "Rewrite concisely", desc: "Polish and tighten your writing.", Icon: Edit3 },
  { title: "Draft follow‑ups", desc: "Compose thoughtful emails quickly.", Icon: Mails },
  { title: "Compare notes", desc: "Spot differences and similarities.", Icon: Layers },
  { title: "Open questions", desc: "Surface missing info and gaps.", Icon: CircleAlert },
  { title: "Make concise", desc: "Bulletize dense paragraphs.", Icon: Wand2 },
];

export default function Marquee() {
  // Duplicate the list in render for a seamless loop (no hydration effects needed)
  const loop = [...cards, ...cards];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/10 py-14">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mask-gradient overflow-hidden">
          <div className="marquee-row flex gap-4 whitespace-nowrap">
            {loop.map((item, i) => (
              <div
                key={i}
                className="card inline-flex h-44 w-72 shrink-0 flex-col items-start justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-5 text-left shadow-sm ring-1 ring-black/0 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03] hover:bg-card/80"
              >
                <item.Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-2 line-clamp-1 text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .marquee-row {
          animation: marquee-x 28s linear infinite;
        }
        @keyframes marquee-x {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        /* Fallback for environments without Tailwind's line-clamp plugin */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}