"use client";

import { useTranslations } from "next-intl";
import { LoginForm } from "@/components/forms/login-form";
import { Modal } from "@/components/modal/modal";
import { useModalStore } from "@/store/modal.store";

export function LoginModal() {
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const open = useModalStore((s) => s.open);
  const type = useModalStore((s) => s.type);
  const closeModal = useModalStore((s) => s.closeModal);

  return (
    <Modal
      open={open && type === "login"}
      title={tAuth("login.title")}
      closeLabel={tCommon("close")}
      onClose={closeModal}
    >
      <LoginForm />
    </Modal>
  );
}
