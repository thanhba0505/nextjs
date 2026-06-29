"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useModalStore } from "@/store/modal.store";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const tAuth = useTranslations("auth");
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const closeModal = useModalStore((s) => s.closeModal);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginSchema = z.object({
    email: z.string().email(tAuth("login.emailInvalid")),
    password: z.string().min(1, tAuth("login.passwordRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await login(values);
      closeModal();
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
      else if (typeof error === "string") setErrorMessage(error);
      else setErrorMessage(tAuth("login.failed"));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <label className="text-sm font-medium">
          {tAuth("login.emailLabel")}
        </label>
        <input
          type="email"
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">
          {tAuth("login.passwordLabel")}
        </label>
        <input
          type="password"
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <Button
        className="w-full"
        type="submit"
        disabled={loading || isSubmitting}
      >
        {loading || isSubmitting
          ? tAuth("login.submitting")
          : tAuth("login.submit")}
      </Button>
    </form>
  );
}
