"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      toast.success(tAuth("toast.loginSuccess"));
      closeModal();
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
      else if (typeof error === "string") setErrorMessage(error);
      else setErrorMessage(tAuth("login.failed"));
      toast.error(tAuth("toast.loginFailed"));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label htmlFor="email">{tAuth("login.emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">{tAuth("login.passwordLabel")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
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
