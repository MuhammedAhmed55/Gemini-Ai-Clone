import { ReactNode } from "react";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-background via-background to-primary/5">
        <Header />
        <main className="flex flex-1 flex-col px-4 pt-6 xl:px-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
