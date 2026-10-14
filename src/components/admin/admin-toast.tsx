"use client";

import { X } from "@phosphor-icons/react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AdminButton } from "@/components/admin/admin-action";

type ToastTone = "success" | "error";
type Toast = { id: number; message: string; tone: ToastTone };
type AdminToastContextValue = { notify: (message: string, tone?: ToastTone) => void };

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback(
    (id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)),
    [],
  );
  const notify = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = Date.now();
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  return (
    <AdminToastContext.Provider value={{ notify }}>
      {children}
      <div className="admin-toast-region">
        {toasts.map((toast) => (
          <div
            aria-live={toast.tone === "error" ? "assertive" : "polite"}
            className={`admin-toast admin-toast-${toast.tone}`}
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
          >
            <p>{toast.message}</p>
            <AdminButton
              aria-label="Dismiss notification"
              onClick={() => dismiss(toast.id)}
              type="button"
              variant="text"
            >
              <X aria-hidden="true" size={16} />
            </AdminButton>
          </div>
        ))}
      </div>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) throw new Error("useAdminToast must be used inside AdminToastProvider.");
  return context;
}
