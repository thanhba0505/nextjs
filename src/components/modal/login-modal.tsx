"use client";

import { LoginForm } from "@/components/forms/login-form";
import { Modal } from "@/components/modal/modal";
import { useModalStore } from "@/store/modal.store";

export function LoginModal() {
  const open = useModalStore((s) => s.open);
  const type = useModalStore((s) => s.type);
  const closeModal = useModalStore((s) => s.closeModal);

  return (
    <Modal open={open && type === "login"} title="Đăng nhập" onClose={closeModal}>
      <LoginForm />
    </Modal>
  );
}
