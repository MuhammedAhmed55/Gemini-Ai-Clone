import Header from "@/components/Header";
import SiteFooter from "@/components/marketing/SiteFooter";

export default function HelpPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Help & Support</h1>
        <p className="mt-4 text-muted-foreground">
          Find answers to common questions about using GoatNote. If you need more help, reach out to our support.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Getting Started</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Create an account and sign in</li>
              <li>Create your first note</li>
              <li>Ask AI about your note</li>
            </ul>
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Troubleshooting</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Check your internet connection</li>
              <li>Ensure you are logged in</li>
              <li>Re-check your API keys and environment variables</li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
