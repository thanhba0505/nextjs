"use client";

import { Footer } from "@/components/layouts/footer";
import { ModalRoot } from "@/components/modal/modal-root";
import { Toaster } from "@/components/ui/sonner";
import {
  MAIN_LAYOUT_PADDING_X_PX,
  MAIN_LAYOUT_PADDING_Y_PX,
  TOASTER_BOTTOM_OFFSET_PX,
} from "@/constants/layout";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main
        className="flex-1"
        style={{
          padding: `${MAIN_LAYOUT_PADDING_Y_PX}px ${MAIN_LAYOUT_PADDING_X_PX}px`,
        }}
      >
        {children}
      </main>
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
