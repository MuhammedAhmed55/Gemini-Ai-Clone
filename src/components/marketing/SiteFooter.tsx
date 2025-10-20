"use client"
import Link from "next/link";

export default function SiteFooter() {
  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "AI Chat", href: "#" },
        { label: "Notes", href: "#" },
        { label: "Pricing", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "#" },
        { label: "Guides", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Security", href: "#" },
        { label: "GDPR", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/60 bg-background/50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-foreground/90">{col.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} GoatNote. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground">Twitter</Link>
            <Link href="#" className="hover:text-foreground">GitHub</Link>
            <Link href="#" className="hover:text-foreground">Community</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
