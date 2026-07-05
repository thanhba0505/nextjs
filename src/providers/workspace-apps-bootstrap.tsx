"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAppStore } from "@/store/app.store";
import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceAppsStore } from "@/store/workspace-apps.store";

export function WorkspaceAppsBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const tWorkspace = useTranslations("workspace");
  const ready = useAppStore((state) => state.ready);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initialized = useWorkspaceAppsStore((state) => state.initialized);
  const initialize = useWorkspaceAppsStore((state) => state.initialize);
  const clear = useWorkspaceAppsStore((state) => state.clear);
  const lastSyncError = useWorkspaceAppsStore((state) => state.lastSyncError);
  const clearSyncError = useWorkspaceAppsStore((state) => state.clearSyncError);
  const lastSyncSuccessAt = useWorkspaceAppsStore(
    (state) => state.lastSyncSuccessAt,
  );
  const clearSyncSuccess = useWorkspaceAppsStore(
    (state) => state.clearSyncSuccess,
  );
  const flushPendingPositionSync = useWorkspaceAppsStore(
    (state) => state.flushPendingPositionSync,
  );

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!isAuthenticated) {
      clear();
      return;
    }

    if (initialized) {
      return;
    }

    void initialize().catch(() => {
      toast.error(tWorkspace("toast.loadAppsFailed"));
    });
  }, [clear, initialize, initialized, isAuthenticated, ready, tWorkspace]);

  useEffect(() => {
    if (!lastSyncError) {
      return;
    }

    toast.error(tWorkspace("toast.syncPositionsFailed"));
    clearSyncError();
  }, [clearSyncError, lastSyncError, tWorkspace]);

  useEffect(() => {
    if (!lastSyncSuccessAt) {
      return;
    }

    toast.success(tWorkspace("toast.syncPositionsSuccess"));
    clearSyncSuccess();
  }, [clearSyncSuccess, lastSyncSuccessAt, tWorkspace]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void flushPendingPositionSync();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void flushPendingPositionSync();
    };
  }, [flushPendingPositionSync]);

  return children;
}
