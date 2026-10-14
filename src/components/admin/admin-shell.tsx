"use client";

import { SignOut } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminButton } from "@/components/admin/admin-action";
import { AdminToastProvider } from "@/components/admin/admin-toast";
import { AdminGuard } from "@/components/admin/admin-guard";
import {
  AdminSessionProvider,
  useAdminSession,
} from "@/features/admin/auth/admin-session-provider";
import type { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
];

function ShellContent({ children }: { children: ReactNode }) {
  const { logout, session } = useAdminSession();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <AdminGuard>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link className="admin-mark" href="/admin">
            <span className="admin-mark-logo">
              <Image alt="Daily Crumb" height={160} priority src="/third-logo.png" width={1000} />
            </span>
          </Link>
          <nav aria-label="Admin navigation">
            {links.map((link) => {
              const active =
                link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={active ? "is-active" : undefined}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="admin-sidebar-bottom">
            <p>{session?.admin.name}</p>
            <AdminButton
              onClick={async () => {
                await logout();
                router.replace("/admin/login");
              }}
              type="button"
              variant="text"
            >
              <SignOut aria-hidden="true" size={18} /> Log out
            </AdminButton>
          </div>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </AdminGuard>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminToastProvider>
        <ShellContent>{children}</ShellContent>
      </AdminToastProvider>
    </AdminSessionProvider>
  );
}
