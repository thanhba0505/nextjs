"use client";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { DesktopIcon } from "@/components/desktop/desktop-icon";
import { DesktopDropSlot } from "@/components/desktop/desktop-drop-slot";
import { FOOTER_HEIGHT_PX, MAIN_LAYOUT_PADDING_Y_PX } from "@/constants/layout";
import { DESKTOP_SURFACE_PADDING_PX } from "@/constants/workspace";
import { useWorkspaceAppsStore } from "@/store/workspace-apps.store";
import {
  calculateGridLayout,
  calculateGridSlots,
  type GridLayout,
} from "./desktop-grid-utils";
import { DesktopAppItem } from "@/types";

export function DesktopIconGrid() {
  const tWorkspace = useTranslations("workspace");
  const desktopApps = useWorkspaceAppsStore((state) => state.desktopApps);
  const taskbarApps = useWorkspaceAppsStore((state) => state.taskbarApps);
  const moveDesktopAppLocal = useWorkspaceAppsStore(
    (state) => state.moveDesktopAppLocal,
  );
  const pinToTaskbar = useWorkspaceAppsStore((state) => state.pinToTaskbar);
  const unpinFromDesktop = useWorkspaceAppsStore(
    (state) => state.unpinFromDesktop,
  );

  const [gridLayout, setGridLayout] = useState<GridLayout>({
    cols: 1,
    iconWidth: 48,
    iconHeight: 64,
    cellWidth: 80,
    cellHeight: 120,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
  );

  // Recalculate grid on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const layout = calculateGridLayout(containerWidth, "MEDIUM");
        setGridLayout(layout);
      }
    };

    // Initial calculation
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const taskbarAppIds = new Set(taskbarApps.map((item) => item.app.id));
  const gridSlots = calculateGridSlots(desktopApps, gridLayout.cols);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Find active and over slots
    const activeSlot = gridSlots.find((slot) => slot.id === activeId);
    const overSlot = gridSlots.find((slot) => slot.id === overId);

    if (
      !activeSlot ||
      !overSlot ||
      activeSlot.type !== "app" ||
      !activeSlot.item
    ) {
      return;
    }

    const appId = activeSlot.item.app.id;
    const targetPosition = overSlot.position;

    moveDesktopAppLocal(appId, targetPosition);
  };

  const handlePinToTaskbar = async (item: DesktopAppItem) => {
    await pinToTaskbar(item.app);
  };

  const handleUnpinFromDesktop = async (item: DesktopAppItem) => {
    await unpinFromDesktop(item.app.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <section
        className="relative overflow-hidden rounded-[28px] border border-border/80 bg-linear-to-br from-sky-500 via-sky-600 to-indigo-700 shadow-sm"
        aria-label={tWorkspace("desktop.surfaceLabel")}
        ref={containerRef}
      >
        <div
          className="relative"
          style={{
            minHeight: `calc(100vh - ${FOOTER_HEIGHT_PX + MAIN_LAYOUT_PADDING_Y_PX * 2}px)`,
            padding: `${DESKTOP_SURFACE_PADDING_PX}px`,
            backgroundImage:
              "linear-gradient(to right, rgb(255 255 255 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.08) 1px, transparent 1px)",
            backgroundPosition: "0 0",
            backgroundSize: `${gridLayout.cellWidth}px ${gridLayout.cellHeight}px`,
          }}
        >
          {gridSlots.length > 0 ? (
            <div
              className="grid justify-items-center gap-3"
              style={{
                gridTemplateColumns: `repeat(${gridLayout.cols}, minmax(0, 1fr))`,
                gridAutoRows: `${gridLayout.cellHeight}px`,
              }}
            >
              {gridSlots.map((slot) => (
                <DesktopDropSlot
                  key={slot.id}
                  slot={slot}
                  cellWidth={gridLayout.cellWidth}
                  cellHeight={gridLayout.cellHeight}
                >
                  {slot.type === "app" && slot.item ? (
                    <DesktopIcon
                      item={slot.item}
                      isPinnedToTaskbar={taskbarAppIds.has(slot.item.app.id)}
                      onPinTaskbar={handlePinToTaskbar}
                      onUnpinDesktop={handleUnpinFromDesktop}
                    />
                  ) : null}
                </DesktopDropSlot>
              ))}
            </div>
          ) : null}

          {desktopApps.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="rounded-2xl border border-white/20 bg-background/20 px-5 py-4 text-center text-sm text-primary-foreground/95 backdrop-blur-sm">
                {tWorkspace("desktop.empty")}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </DndContext>
  );
}
