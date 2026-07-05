import type { DesktopAppItem, TaskbarAppItem } from "@/types";

export function calculateTaskbarSortableIds(
  taskbarApps: TaskbarAppItem[],
): number[] {
  return taskbarApps.map((item) => item.app.id);
}

export function getDesktopAppIds(desktopApps: DesktopAppItem[]): Set<number> {
  return new Set(desktopApps.map((item) => item.app.id));
}
