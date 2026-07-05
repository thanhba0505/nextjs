"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Pin, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { DesktopAppItem } from "@/types";
import { DESKTOP_ICON_SIZE, DESKTOP_CELL_PADDING } from "@/constants/workspace";

interface DesktopIconProps {
  item: DesktopAppItem & { gridCol?: number; gridRow?: number };
  isPinnedToTaskbar: boolean;
  onPinTaskbar: (item: DesktopAppItem) => Promise<void>;
  onUnpinDesktop: (item: DesktopAppItem) => Promise<void>;
}

export function DesktopIcon({
  item,
  isPinnedToTaskbar,
  onPinTaskbar,
  onUnpinDesktop,
}: DesktopIconProps) {
  const tWorkspace = useTranslations("workspace");
  const [iconFailed, setIconFailed] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `app-${item.app.id}`,
    });

  const iconSize = DESKTOP_ICON_SIZE.MEDIUM; // Use medium size
  const cellWidth = iconSize.width + DESKTOP_CELL_PADDING * 2;
  const cellHeight = iconSize.height + DESKTOP_CELL_PADDING * 2 + 24; // 24px for label

  const handlePinTaskbar = async () => {
    try {
      await onPinTaskbar(item);
    } catch {
      toast.error(tWorkspace("toast.pinTaskbarFailed"));
    }
  };

  const handleUnpinDesktop = async () => {
    try {
      await onUnpinDesktop(item);
    } catch {
      toast.error(tWorkspace("toast.unpinDesktopFailed"));
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          ref={setNodeRef}
          type="button"
          style={{
            transform: CSS.Translate.toString(transform),
            zIndex: isDragging ? 20 : 1,
            width: `${cellWidth}px`,
            height: `${cellHeight}px`,
          }}
          className="group flex touch-none cursor-default flex-col items-center gap-2 rounded-xl p-2 text-center outline-none transition-colors hover:bg-background/15 focus-visible:bg-background/20"
          aria-label={item.app.name}
          {...listeners}
          {...attributes}
        >
          <div
            className="flex items-center justify-center rounded-2xl bg-background/70 shadow-sm ring-1 ring-border/70"
            style={{
              width: `${iconSize.width}px`,
              height: `${iconSize.height}px`,
            }}
          >
            {item.app.icon && !iconFailed ? (
              <div
                style={{
                  position: "relative",
                  width: `${iconSize.width - 8}px`,
                  height: `${iconSize.height - 8}px`,
                }}
              >
                <Image
                  src={item.app.icon}
                  alt=""
                  fill
                  className="object-contain"
                  unoptimized={true}
                  onError={() => {
                    setIconFailed(true);
                  }}
                />
              </div>
            ) : (
              <span className="text-xl font-semibold text-primary">
                {item.app.name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>

          <span className="line-clamp-2 text-xs font-medium leading-4 text-primary-foreground/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]">
            {item.app.name}
          </span>
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-52">
        <ContextMenuLabel>{item.app.name}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem
          disabled={isPinnedToTaskbar}
          onSelect={() => {
            void handlePinTaskbar();
          }}
        >
          <Pin className="h-4 w-4" />
          {tWorkspace("menu.pinTaskbar")}
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          onSelect={() => {
            void handleUnpinDesktop();
          }}
        >
          <X className="h-4 w-4" />
          {tWorkspace("menu.unpinDesktop")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
