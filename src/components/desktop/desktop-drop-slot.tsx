"use client";

import { useDroppable } from "@dnd-kit/core";
import type { GridSlot } from "./desktop-grid-utils";

interface DesktopDropSlotProps {
  slot: GridSlot;
  cellWidth: number;
  cellHeight: number;
  children?: React.ReactNode;
}

export function DesktopDropSlot({
  slot,
  cellWidth,
  cellHeight,
  children,
}: DesktopDropSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: slot.id,
  });

  const showDropIndicator = slot.type === "empty" && isOver;

  return (
    <div
      ref={setNodeRef}
      className="flex items-center justify-center rounded-xl"
      style={{
        width: `${cellWidth}px`,
        height: `${cellHeight}px`,
        backgroundColor: showDropIndicator
          ? "rgb(255 255 255 / 0.12)"
          : "transparent",
        outline: showDropIndicator
          ? "1px dashed rgb(255 255 255 / 0.45)"
          : "none",
        outlineOffset: showDropIndicator ? "-1px" : "0",
      }}
      aria-label={
        slot.type === "app"
          ? slot.item?.app.name
          : `Empty slot at position ${slot.position}`
      }
    >
      {children}
    </div>
  );
}
