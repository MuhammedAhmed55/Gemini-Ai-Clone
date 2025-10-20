import Header from "@/components/Header";
import SiteFooter from "@/components/marketing/SiteFooter";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">About GoatNote</h1>
        <p className="mt-4 text-muted-foreground">
          GoatNote helps you capture ideas, organize them into nodes, and ask AI questions directly about your notes.
          It’s fast, modern, and built with an ergonomic UI so you can focus on thinking.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Our Mission</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Make knowledge work simpler by combining note‑taking with a helpful AI assistant.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">What You Can Do</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Create notes and structure them into nodes</li>
              <li>Summarize, extract action items, and explain concepts</li>
              <li>Chat with AI that understands your context</li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
