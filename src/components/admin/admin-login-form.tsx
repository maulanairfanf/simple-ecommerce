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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(adminLoginSchema) });
  const submit = async (values: LoginValues) => {
    try {
      await login(values.username, values.password);
      router.replace("/admin");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign-in failed. Try again.";
      setError("root", { message });
    }
  };
  return (
    <form className="admin-login-form" onSubmit={handleSubmit(submit)} noValidate>
      <div>
        <p className="admin-eyebrow">Staff access</p>
        <h1>Keep the counter moving.</h1>
        <p>Use your staff username and password to access the shop administration.</p>
      </div>
      {params.get("reason") === "expired" && (
        <p className="admin-form-alert">Your admin session expired. Sign in again to continue.</p>
      )}
      <label>
        Username
        <input autoComplete="username" {...register("username")} />
        {errors.username && <span>{errors.username.message}</span>}
      </label>
      <label>
        Password
        <input autoComplete="current-password" {...register("password")} type="password" />
        {errors.password && <span>{errors.password.message}</span>}
      </label>
      {errors.root && (
        <p className="admin-form-alert" role="alert">
          {errors.root.message}
        </p>
      )}
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
