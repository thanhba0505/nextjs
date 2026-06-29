"use client";

import { Footer } from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";
import { ModalRoot } from "@/components/modal/modal-root";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ModalRoot />
    </div>
  );
}
