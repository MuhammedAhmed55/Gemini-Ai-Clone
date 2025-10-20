import Header from "@/components/Header";
import SiteFooter from "@/components/marketing/SiteFooter";

export default function DocsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
        <p className="mt-4 text-muted-foreground">
          Learn how to use GoatNote. These quick docs cover the basics of creating notes, organizing nodes, and using AI to assist your workflow.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Notes & Nodes</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Create a new note from the Dashboard.</li>
              <li>Use nodes (sections) to structure larger documents.</li>
              <li>Keep titles concise for better AI context.</li>
            </ul>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Ask AI</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Open "Ask AI" to summarize or extract action items.</li>
              <li>Ask follow‑up questions to go deeper on a topic.</li>
              <li>Use concise prompts for best results.</li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
