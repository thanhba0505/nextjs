"use client";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { TaskbarAppIcon } from "@/components/taskbar/taskbar-app-icon";
import { useWorkspaceAppsStore } from "@/store/workspace-apps.store";
import { calculateTaskbarSortableIds, getDesktopAppIds } from "./taskbar-utils";
import type { TaskbarAppItem } from "@/types";

export function TaskbarAppList() {
  const taskbarApps = useWorkspaceAppsStore((state) => state.taskbarApps);
  const desktopApps = useWorkspaceAppsStore((state) => state.desktopApps);
  const moveTaskbarAppLocal = useWorkspaceAppsStore(
    (state) => state.moveTaskbarAppLocal,
  );
  const pinToDesktop = useWorkspaceAppsStore((state) => state.pinToDesktop);
  const unpinFromTaskbar = useWorkspaceAppsStore(
    (state) => state.unpinFromTaskbar,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const desktopAppIds = getDesktopAppIds(desktopApps);
  const sortableIds = calculateTaskbarSortableIds(taskbarApps);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const activeAppId = Number(active.id);
    const overAppId = Number(over.id);
    const overItem = taskbarApps.find((item) => item.app.id === overAppId);

    if (!overItem) {
      return;
    }

    moveTaskbarAppLocal(activeAppId, overItem.position);
  };

  const handlePinToDesktop = async (taskbarItem: TaskbarAppItem) => {
    await pinToDesktop(taskbarItem.app);
  };

  const handleUnpinFromTaskbar = async (taskbarItem: TaskbarAppItem) => {
    await unpinFromTaskbar(taskbarItem.app.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-12 min-w-60 items-center justify-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1.5 shadow-sm backdrop-blur">
        {taskbarApps.length === 0 ? (
          <span className="px-3 text-xs text-muted-foreground">
            No apps pinned
          </span>
        ) : (
          <SortableContext
            items={sortableIds}
            strategy={horizontalListSortingStrategy}
          >
            {taskbarApps.map((item) => (
              <TaskbarAppIcon
                key={item.id}
                item={item}
                isPinnedToDesktop={desktopAppIds.has(item.app.id)}
                onPinDesktop={handlePinToDesktop}
                onUnpinTaskbar={handleUnpinFromTaskbar}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </DndContext>
  );
}
