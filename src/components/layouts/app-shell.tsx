"use client";

import { Footer } from "@/components/layouts/footer";
import { ModalRoot } from "@/components/modal/modal-root";
import { Toaster } from "@/components/ui/sonner";
import { TOASTER_BOTTOM_OFFSET_PX } from "@/constants/layout";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster
        position="bottom-right"
        offset={{ bottom: `${TOASTER_BOTTOM_OFFSET_PX}px` }}
        duration={2000}
      />
      <ModalRoot />
    </div>
  );
}
