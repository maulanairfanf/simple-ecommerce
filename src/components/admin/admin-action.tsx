import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from "react";

type AdminActionVariant = "primary" | "secondary" | "danger" | "destructive" | "text";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: AdminActionVariant;
};

type AdminActionLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode;
  variant?: Exclude<AdminActionVariant, "danger" | "destructive">;
};

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(function AdminButton(
  {
    children,
    className,
    disabled,
    isLoading = false,
    loadingLabel = "Working...",
    variant = "primary",
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      aria-busy={isLoading || undefined}
      className={["admin-button", `admin-button-${variant}`, className].filter(Boolean).join(" ")}
      disabled={disabled || isLoading}
      ref={ref}
    >
      {isLoading ? loadingLabel : children}
    </button>
  );
});

export function AdminActionLink({
  children,
  className,
  variant = "primary",
  ...props
}: AdminActionLinkProps) {
  return (
    <Link
      {...props}
      className={["admin-button", `admin-button-${variant}`, className].filter(Boolean).join(" ")}
    >
      {children}
    </Link>
  );
}

export function AdminActionGroup({ children }: { children: ReactNode }) {
  return <div className="admin-action-group">{children}</div>;
}
