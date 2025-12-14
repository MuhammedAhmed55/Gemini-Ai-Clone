import Header from "@/components/Header";
import Hero from "@/components/marketing/Hero";
import FeatureCards from "@/components/marketing/FeatureCards";
import Marquee from "@/components/marketing/Marquee";
import SiteFooter from "@/components/marketing/SiteFooter";
import StatsAndTestimonials from "@/components/marketing/StatsAndTestimonials";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";
import { getUser } from "@/auth/server";
import { redirect } from "next/navigation";
import Features from "@/components/marketing/Feature";

export default async function LandingPage() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-background via-background to-primary/5">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Features />
        <Marquee />
        <FeatureCards />
        <StatsAndTestimonials />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}

