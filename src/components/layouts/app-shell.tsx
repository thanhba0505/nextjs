"use client";

import { Footer } from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";
import { ModalRoot } from "@/components/modal/modal-root";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster
        position="bottom-right"
        offset={{ bottom: "72px" }}
        duration={2000}
      />
      <ModalRoot />
    </div>
  );
}
