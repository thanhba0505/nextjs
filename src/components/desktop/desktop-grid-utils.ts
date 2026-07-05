import type { DesktopAppItem } from "@/types";
import {
  DESKTOP_ICON_SIZE,
  DESKTOP_CELL_PADDING,
  DESKTOP_SURFACE_PADDING_PX,
  type DesktopIconSize,
} from "@/constants/workspace";

export interface GridLayout {
  cols: number;
  iconWidth: number;
  iconHeight: number;
  cellWidth: number;
  cellHeight: number;
}

export interface GridSlot {
  id: string;
  type: "app" | "empty";
  position: number;
  col: number;
  row: number;
  item?: DesktopAppItem;
}

export function calculateGridLayout(
  containerWidth: number,
  iconSize: DesktopIconSize = "MEDIUM",
): GridLayout {
  const iconSizeConfig = DESKTOP_ICON_SIZE[iconSize];

  // Cell width = icon width + padding * 2
  const cellWidth = iconSizeConfig.width + DESKTOP_CELL_PADDING * 2;
  const cellHeight = iconSizeConfig.height + DESKTOP_CELL_PADDING * 2 + 24; // + 24px for label

  // Available width = container width - surface padding * 2
  const availableWidth = containerWidth - DESKTOP_SURFACE_PADDING_PX * 2;

  // Calculate number of columns that fit
  const cols = Math.max(1, Math.floor(availableWidth / cellWidth));

  return {
    cols,
    iconWidth: iconSizeConfig.width,
    iconHeight: iconSizeConfig.height,
    cellWidth,
    cellHeight,
  };
}

export function calculateGridSlots(
  desktopApps: DesktopAppItem[],
  cols: number,
): GridSlot[] {
  if (cols === 0) return [];

  const slots: GridSlot[] = [];
  const sortedApps = [...desktopApps].sort((a, b) => a.position - b.position);
  const maxPosition = sortedApps.reduce(
    (currentMax, item) => Math.max(currentMax, item.position),
    0,
  );

  // Calculate number of rows needed (at least 3 rows for empty slots)
  const minRows = 3;
  const itemsPerRow = cols;
  const totalSlots = Math.max(
    sortedApps.length,
    maxPosition,
    minRows * itemsPerRow,
  );

  // Create slots for each position
  for (let i = 0; i < totalSlots; i++) {
    const position = i + 1; // position starts from 1
    const col = i % cols;
    const row = Math.floor(i / cols);

    // Find app at this position
    const appItem = sortedApps.find((item) => item.position === position);

    if (appItem) {
      // Slot with app
      slots.push({
        id: `app-${appItem.app.id}`,
        type: "app",
        position,
        col,
        row,
        item: appItem,
      });
    } else {
      // Empty slot (placeholder)
      slots.push({
        id: `empty-${position}`,
        type: "empty",
        position,
        col,
        row,
      });
    }
  }

  return slots;
}
