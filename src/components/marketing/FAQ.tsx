"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is AI Note Assistant?",
    answer:
      "AI Note Assistant is a powerful platform that combines note-taking with artificial intelligence to help you organize, refine, and understand your thoughts better. Our AI analyzes your notes and provides intelligent suggestions and insights.",
  },
  {
    question: "How does the AI help with my notes?",
    answer:
      "The AI can summarize your notes, provide explanations, suggest improvements to your writing, help you brainstorm ideas, and answer questions about your content. Just ask the AI anything about your notes!",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Yes, your data is completely secure. We use enterprise-grade encryption with Supabase, and your notes are only accessible to you. We never share or sell your data.",
  },
  {
    question: "Can I collaborate with others?",
    answer:
      "Currently, notes are personal. However, you can easily copy and share note content through our dashboard. Team collaboration features are coming soon!",
  },
  {
    question: "What's included in a free account?",
    answer:
      "Free accounts include unlimited note creation, basic AI features, and full access to our dashboard. Premium features like advanced AI analysis and priority support are available on paid plans.",
  },
  {
    question: "Can I export my notes?",
    answer:
      "Yes! You can download your notes as text files or copy them to your clipboard. We're working on adding more export formats like PDF and Markdown.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="mx-auto w-full max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-semibold text-primary">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our AI-powered note-taking platform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-primary/5 transition-colors"
              >
                <h3 className="text-base sm:text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Didn't find what you're looking for?
          </p>
          <a
            href="/help"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            Browse Help Center
          </a>
        </div>
      </div>
    </section>
  );
}
