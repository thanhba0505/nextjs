// Desktop icon sizes
export const DESKTOP_ICON_SIZE = {
  SMALL: { width: 30, height: 40 },
  MEDIUM: { width: 48, height: 64 },
  LARGE: { width: 64, height: 86 },
} as const;

export type DesktopIconSize = keyof typeof DESKTOP_ICON_SIZE;

// Desktop grid cell padding (space between icons)
export const DESKTOP_CELL_PADDING = 16;

// Desktop surface padding (space from edge of desktop to first icon)
export const DESKTOP_SURFACE_PADDING_PX = 40;

// Position sync delay in milliseconds
export const POSITION_SYNC_DELAY_MS = 3000;
