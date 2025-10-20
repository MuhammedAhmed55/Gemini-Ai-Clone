import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./DarkModeToggle";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getUser } from "@/auth/server";
import { LogoutButton } from "@/components/auth/LogoutButton";

async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-lg shadow-md">
            G
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">Goat</span>
            <span className="text-foreground">Note</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link 
            href="/about" 
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            About
          </Link>
          <Link 
            href="/help" 
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Help
          </Link>
          <Link 
            href="/docs" 
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Docs
          </Link>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Desktop buttons */}
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <>
                <Button asChild size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">Help</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/docs">Docs</Link>
                </DropdownMenuItem>
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </DropdownMenuItem>
                    <div className="p-2">
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign Up</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Theme toggle visible at all sizes */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;