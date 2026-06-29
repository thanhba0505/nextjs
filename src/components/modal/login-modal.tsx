"use client";

import { useTranslations } from "next-intl";
import { LoginForm } from "@/components/forms/login-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/modal.store";

export function LoginModal() {
  const tAuth = useTranslations("auth");
  const open = useModalStore((s) => s.open);
  const type = useModalStore((s) => s.type);
  const closeModal = useModalStore((s) => s.closeModal);

  return (
    <Dialog
      open={open && type === "login"}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeModal();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tAuth("login.title")}</DialogTitle>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
