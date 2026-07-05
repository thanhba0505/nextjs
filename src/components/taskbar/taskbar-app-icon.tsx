"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Monitor } from "lucide-react";
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
import type { TaskbarAppItem } from "@/types";

interface TaskbarAppIconProps {
  item: TaskbarAppItem;
  isPinnedToDesktop: boolean;
  onPinDesktop: (item: TaskbarAppItem) => Promise<void>;
  onUnpinTaskbar: (item: TaskbarAppItem) => Promise<void>;
}

export function TaskbarAppIcon({
  item,
  isPinnedToDesktop,
  onPinDesktop,
  onUnpinTaskbar,
}: TaskbarAppIconProps) {
  const tWorkspace = useTranslations("workspace");
  const [iconFailed, setIconFailed] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.app.id,
  });

  const handlePinDesktop = async () => {
    try {
      await onPinDesktop(item);
    } catch {
      toast.error(tWorkspace("toast.pinDesktopFailed"));
    }
  };

  const handleUnpinTaskbar = async () => {
    try {
      await onUnpinTaskbar(item);
    } catch {
      toast.error(tWorkspace("toast.unpinTaskbarFailed"));
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          ref={setNodeRef}
          type="button"
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
            zIndex: isDragging ? 20 : 1,
          }}
          className="flex h-11 w-11 touch-none items-center justify-center rounded-xl bg-background/85 shadow-sm ring-1 ring-border/80 transition-colors hover:bg-accent"
          aria-label={item.app.name}
          {...listeners}
          {...attributes}
        >
          {item.app.icon && !iconFailed ? (
            <div
              style={{
                position: "relative",
                width: "24px",
                height: "24px",
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
            <span className="text-sm font-semibold text-primary">
              {item.app.name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-52">
        <ContextMenuLabel>{item.app.name}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem
          disabled={isPinnedToDesktop}
          onSelect={() => {
            void handlePinDesktop();
          }}
        >
          <Monitor className="h-4 w-4" />
          {tWorkspace("menu.pinDesktop")}
        </ContextMenuItem>
        <ContextMenuItem
          variant="destructive"
          onSelect={() => {
            void handleUnpinTaskbar();
          }}
        >
          <X className="h-4 w-4" />
          {tWorkspace("menu.unpinTaskbar")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
