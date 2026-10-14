"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdminSession } from "@/features/admin/auth/admin-session-provider";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { ready, session } = useAdminSession();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) router.replace("/admin/login?reason=expired");
  }, [ready, router, session]);

  if (!ready || !session)
    return (
      <main className="admin-loading">
        <p>Checking admin access...</p>
      </main>
    );
  return <>{children}</>;
}
