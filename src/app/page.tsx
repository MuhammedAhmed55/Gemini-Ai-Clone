import Header from "@/components/Header";
import Hero from "@/components/marketing/Hero";
import FeatureCards from "@/components/marketing/FeatureCards";
import Marquee from "@/components/marketing/Marquee";
import SiteFooter from "@/components/marketing/SiteFooter";
import { getUser } from "@/auth/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Marquee />
        <FeatureCards />
      </main>
      <SiteFooter />
    </div>
  );
}

