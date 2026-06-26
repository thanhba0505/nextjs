"use client";

import { useEffect } from "react";
import { onAuthInvalidated } from "@/lib/auth-events";
import { useAppStore } from "@/store/app.store";
import { useAuthStore } from "@/store/auth.store";
import { getAccessToken } from "@/utils/tokens";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const clear = useAuthStore((s) => s.clear);
  const setReady = useAppStore((s) => s.setReady);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setReady(true);
      return;
    }

    fetchMe()
      .catch(() => {
        clear();
      })
      .finally(() => {
        setReady(true);
      });
  }, [clear, fetchMe, setReady]);

  useEffect(() => {
    return onAuthInvalidated(() => {
      clear();
    });
  }, [clear]);

  return children;
}
