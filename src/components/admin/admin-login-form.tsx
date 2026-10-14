"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AdminButton } from "@/components/admin/admin-action";
import {
  AdminSessionProvider,
  useAdminSession,
} from "@/features/admin/auth/admin-session-provider";
import { adminLoginSchema, type AdminLoginValues } from "@/features/admin/auth/login-schema";

type LoginValues = AdminLoginValues;

function LoginForm() {
  const { login } = useAdminSession();
  const router = useRouter();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(adminLoginSchema) });
  const submit = async (values: LoginValues) => {
    await login(values.email, values.password);
    router.replace("/admin");
  };
  return (
    <form className="admin-login-form" onSubmit={handleSubmit(submit)} noValidate>
      <div>
        <p className="admin-eyebrow">Staff access</p>
        <h1>Keep the counter moving.</h1>
        <p>
          Development-only mock sign-in. The Go backend will replace this with a secure server
          session.
        </p>
      </div>
      {params.get("reason") === "expired" && (
        <p className="admin-form-alert">Your admin session expired. Sign in again to continue.</p>
      )}
      <label>
        Email
        <input autoComplete="email" {...register("email")} type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </label>
      <label>
        Password
        <input autoComplete="current-password" {...register("password")} type="password" />
        {errors.password && <span>{errors.password.message}</span>}
      </label>
      <AdminButton isLoading={isSubmitting} loadingLabel="Signing in..." type="submit">
        Sign in to admin
      </AdminButton>
    </form>
  );
}

export function AdminLoginForm() {
  return (
    <AdminSessionProvider>
      <LoginForm />
    </AdminSessionProvider>
  );
}
