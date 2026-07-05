import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AppItem, DesktopAppItem, TaskbarAppItem } from "@/types";
import { DesktopAppsService } from "@/services/desktop-apps.service";
import { TaskbarAppsService } from "@/services/taskbar-apps.service";
import { POSITION_SYNC_DELAY_MS } from "@/constants/workspace";

function sortDesktopApps(items: DesktopAppItem[]): DesktopAppItem[] {
  return [...items].sort((a, b) => a.position - b.position);
}

function sortTaskbarApps(items: TaskbarAppItem[]): TaskbarAppItem[] {
  return [...items].sort((a, b) => a.position - b.position);
}

function normalizeTaskbarPositions(items: TaskbarAppItem[]): TaskbarAppItem[] {
  return sortTaskbarApps(items).map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}

function reorderDesktopApps(
  items: DesktopAppItem[],
  appId: number,
  targetPosition: number,
): DesktopAppItem[] {
  const nextItems = items.map((item) => ({ ...item }));
  const movingItem = nextItems.find((item) => item.app.id === appId);

  if (!movingItem) {
    return sortDesktopApps(nextItems);
  }

  const currentPosition = movingItem.position;
  const targetItem = nextItems.find(
    (item) => item.app.id !== appId && item.position === targetPosition,
  );

  if (currentPosition === targetPosition) {
    return sortDesktopApps(nextItems);
  }

  if (targetItem) {
    targetItem.position = currentPosition;
    movingItem.position = targetPosition;
  } else {
    movingItem.position = targetPosition;
  }

  return sortDesktopApps(nextItems);
}

function reorderTaskbarApps(
  items: TaskbarAppItem[],
  appId: number,
  targetPosition: number,
): TaskbarAppItem[] {
  const nextItems = sortTaskbarApps(items);
  const sourceIndex = nextItems.findIndex((item) => item.app.id === appId);

  if (sourceIndex === -1) {
    return normalizeTaskbarPositions(nextItems);
  }

  // Tìm index của item có position = targetPosition
  const targetIndex = nextItems.findIndex(
    (item) => item.position === targetPosition,
  );

  if (targetIndex === -1) {
    // Nếu không tìm thấy item với targetPosition (kéo vào ô trống?)
    // Thì chèn vào vị trí targetPosition - 1 (vì position bắt đầu từ 1)
    const [movingItem] = nextItems.splice(sourceIndex, 1);
    const clampedTargetIndex = Math.min(
      Math.max(targetPosition - 1, 0),
      nextItems.length,
    );
    nextItems.splice(clampedTargetIndex, 0, movingItem);
  } else {
    // Hoán đổi vị trí: app A ↔ app B
    const temp = nextItems[sourceIndex];
    nextItems[sourceIndex] = nextItems[targetIndex];
    nextItems[targetIndex] = temp;

    // Cập nhật position sau khi hoán đổi
    nextItems[sourceIndex] = {
      ...nextItems[sourceIndex],
      position: nextItems[targetIndex].position,
    };
    nextItems[targetIndex] = {
      ...nextItems[targetIndex],
      position: temp.position,
    };
  }

  return normalizeTaskbarPositions(nextItems);
}

function areDesktopPositionsEqual(
  leftItems: DesktopAppItem[],
  rightItems: DesktopAppItem[],
): boolean {
  if (leftItems.length !== rightItems.length) {
    return false;
  }

  return leftItems.every((item, index) => {
    const rightItem = rightItems[index];

    return (
      item.app.id === rightItem?.app.id && item.position === rightItem.position
    );
  });
}

function areTaskbarPositionsEqual(
  leftItems: TaskbarAppItem[],
  rightItems: TaskbarAppItem[],
): boolean {
  if (leftItems.length !== rightItems.length) {
    return false;
  }

  return leftItems.every((item, index) => {
    const rightItem = rightItems[index];

    return (
      item.app.id === rightItem?.app.id && item.position === rightItem.position
    );
  });
}

type WorkspaceSyncError = "desktop" | "taskbar" | null;
type WorkspaceSyncSuccess = "desktop" | "taskbar" | null;

interface WorkspaceAppsState {
  desktopApps: DesktopAppItem[];
  taskbarApps: TaskbarAppItem[];
  initialized: boolean;
  loading: boolean;
  desktopPositionsDirty: boolean;
  taskbarPositionsDirty: boolean;
  lastSyncError: WorkspaceSyncError;
  lastSyncSuccess: WorkspaceSyncSuccess;
  lastSyncSuccessAt: number | null;
  initialize: (force?: boolean) => Promise<void>;
  clear: () => void;
  pinToTaskbar: (app: AppItem) => Promise<void>;
  unpinFromTaskbar: (appId: number) => Promise<void>;
  pinToDesktop: (app: AppItem) => Promise<void>;
  unpinFromDesktop: (appId: number) => Promise<void>;
  moveDesktopAppLocal: (appId: number, targetPosition: number) => void;
  moveTaskbarAppLocal: (appId: number, targetPosition: number) => void;
  flushDesktopPositions: () => Promise<void>;
  flushTaskbarPositions: () => Promise<void>;
  flushPendingPositionSync: () => Promise<void>;
  clearSyncError: () => void;
  clearSyncSuccess: () => void;
}

let desktopSyncTimer: NodeJS.Timeout | null = null;
let taskbarSyncTimer: NodeJS.Timeout | null = null;

const clearDesktopSyncTimer = () => {
  if (desktopSyncTimer) {
    clearTimeout(desktopSyncTimer);
    desktopSyncTimer = null;
  }
};

const clearTaskbarSyncTimer = () => {
  if (taskbarSyncTimer) {
    clearTimeout(taskbarSyncTimer);
    taskbarSyncTimer = null;
  }
};

export const useWorkspaceAppsStore = create<WorkspaceAppsState>()(
  devtools(
    (set, get) => ({
      desktopApps: [],
      taskbarApps: [],
      initialized: false,
      loading: false,
      desktopPositionsDirty: false,
      taskbarPositionsDirty: false,
      lastSyncError: null,
      lastSyncSuccess: null,
      lastSyncSuccessAt: null,

      initialize: async (force = false) => {
        if (get().initialized && !force) {
          return;
        }

        set({ loading: true });

        try {
          const [desktopResponse, taskbarResponse] = await Promise.all([
            DesktopAppsService.list(),
            TaskbarAppsService.list(),
          ]);

          set({
            desktopApps: sortDesktopApps(desktopResponse.data.desktop_apps),
            taskbarApps: normalizeTaskbarPositions(
              taskbarResponse.data.taskbar_apps,
            ),
            initialized: true,
            loading: false,
            desktopPositionsDirty: false,
            taskbarPositionsDirty: false,
          });
        } catch (error) {
          console.error("Failed to initialize workspace apps:", error);
          set({ loading: false });
          throw error;
        }
      },

      clear: () => {
        clearDesktopSyncTimer();
        clearTaskbarSyncTimer();
        set({
          desktopApps: [],
          taskbarApps: [],
          initialized: false,
          desktopPositionsDirty: false,
          taskbarPositionsDirty: false,
          lastSyncError: null,
          lastSyncSuccess: null,
          lastSyncSuccessAt: null,
        });
      },

      pinToTaskbar: async (app) => {
        try {
          const response = await TaskbarAppsService.pin({
            taskbar_app: {
              app_id: app.id,
              position: get().taskbarApps.length + 1, // Add to end
            },
          });
          set((state) => ({
            taskbarApps: normalizeTaskbarPositions([
              ...state.taskbarApps,
              response.data.taskbar_app,
            ]),
          }));
        } catch (error) {
          console.error("Failed to pin to taskbar:", error);
          throw error;
        }
      },

      unpinFromTaskbar: async (appId) => {
        try {
          await TaskbarAppsService.unpin(appId);
          set((state) => ({
            taskbarApps: normalizeTaskbarPositions(
              state.taskbarApps.filter((item) => item.app.id !== appId),
            ),
            taskbarPositionsDirty: true,
          }));
        } catch (error) {
          console.error("Failed to unpin from taskbar:", error);
          throw error;
        }
      },

      pinToDesktop: async (app) => {
        try {
          const maxDesktopPosition = get().desktopApps.reduce(
            (maxPosition, item) => Math.max(maxPosition, item.position),
            0,
          );
          const response = await DesktopAppsService.pin({
            desktop_app: {
              app_id: app.id,
              position: maxDesktopPosition + 1,
            },
          });
          set((state) => ({
            desktopApps: sortDesktopApps([
              ...state.desktopApps,
              response.data.desktop_app,
            ]),
          }));
        } catch (error) {
          console.error("Failed to pin to desktop:", error);
          throw error;
        }
      },

      unpinFromDesktop: async (appId) => {
        try {
          await DesktopAppsService.unpin(appId);
          set((state) => ({
            desktopApps: sortDesktopApps(
              state.desktopApps.filter((item) => item.app.id !== appId),
            ),
            desktopPositionsDirty: true,
          }));
        } catch (error) {
          console.error("Failed to unpin from desktop:", error);
          throw error;
        }
      },

      moveDesktopAppLocal: (appId, targetPosition) => {
        const nextDesktopApps = reorderDesktopApps(
          get().desktopApps,
          appId,
          targetPosition,
        );

        if (areDesktopPositionsEqual(get().desktopApps, nextDesktopApps)) {
          return;
        }

        set({
          desktopApps: nextDesktopApps,
          desktopPositionsDirty: true,
        });

        clearDesktopSyncTimer();
        desktopSyncTimer = setTimeout(() => {
          void get().flushDesktopPositions();
        }, POSITION_SYNC_DELAY_MS);
      },

      moveTaskbarAppLocal: (appId, targetPosition) => {
        const nextTaskbarApps = reorderTaskbarApps(
          get().taskbarApps,
          appId,
          targetPosition,
        );

        if (areTaskbarPositionsEqual(get().taskbarApps, nextTaskbarApps)) {
          return;
        }

        set({
          taskbarApps: nextTaskbarApps,
          taskbarPositionsDirty: true,
        });

        clearTaskbarSyncTimer();
        taskbarSyncTimer = setTimeout(() => {
          void get().flushTaskbarPositions();
        }, POSITION_SYNC_DELAY_MS);
      },

      flushDesktopPositions: async () => {
        if (!get().desktopPositionsDirty) {
          return;
        }

        try {
          const desktopApps = get().desktopApps;
          const payload = {
            desktop_apps: desktopApps.map((item) => ({
              app_id: item.app.id,
              position: item.position,
            })),
          };

          await DesktopAppsService.updatePositions(payload);

          set({
            desktopPositionsDirty: false,
            lastSyncSuccess: "desktop",
            lastSyncSuccessAt: Date.now(),
          });
        } catch (error) {
          console.error("Failed to sync desktop positions:", error);
          set({
            lastSyncError: "desktop",
          });
          throw error;
        }
      },

      flushTaskbarPositions: async () => {
        if (!get().taskbarPositionsDirty) {
          return;
        }

        try {
          const taskbarApps = get().taskbarApps;
          const payload = {
            taskbar_apps: taskbarApps.map((item) => ({
              app_id: item.app.id,
              position: item.position,
            })),
          };

          await TaskbarAppsService.updatePositions(payload);

          set({
            taskbarPositionsDirty: false,
            lastSyncSuccess: "taskbar",
            lastSyncSuccessAt: Date.now(),
          });
        } catch (error) {
          console.error("Failed to sync taskbar positions:", error);
          set({
            lastSyncError: "taskbar",
          });
          throw error;
        }
      },

      flushPendingPositionSync: async () => {
        clearDesktopSyncTimer();
        clearTaskbarSyncTimer();

        const promises: Array<Promise<void>> = [];
        if (get().desktopPositionsDirty) {
          promises.push(get().flushDesktopPositions());
        }
        if (get().taskbarPositionsDirty) {
          promises.push(get().flushTaskbarPositions());
        }

        if (promises.length > 0) {
          try {
            await Promise.all(promises);
          } catch (error) {
            console.error("Failed to flush position sync:", error);
            throw error;
          }
        }
      },

      clearSyncError: () => {
        set({ lastSyncError: null });
      },

      clearSyncSuccess: () => {
        set({ lastSyncSuccess: null, lastSyncSuccessAt: null });
      },
    }),
    {
      name: "workspace-apps-store",
    },
  ),
);
