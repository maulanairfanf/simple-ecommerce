"use client";

import { useEffect, useRef, useState } from "react";
import { AdminActionGroup, AdminButton } from "@/components/admin/admin-action";

type AdminConfirmDialogProps = {
  confirmLabel: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  title: string;
};

export function AdminConfirmDialog({
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
}: AdminConfirmDialogProps) {
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isConfirming, onCancel]);

  const confirm = async () => {
    setError("");
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "This action could not be completed. Try again.",
      );
      setIsConfirming(false);
    }
  };

  return (
    <div
      aria-busy={isConfirming}
      aria-labelledby="admin-confirm-title"
      aria-modal="true"
      className="admin-confirm"
      role="dialog"
    >
      <div>
        <h2 id="admin-confirm-title">{title}</h2>
        <p>{description}</p>
        {error && <p className="admin-form-alert">{error}</p>}
        <AdminActionGroup>
          <AdminButton onClick={onCancel} ref={cancelButtonRef} type="button" variant="secondary">
            Cancel
          </AdminButton>
          <AdminButton
            isLoading={isConfirming}
            loadingLabel="Working..."
            onClick={confirm}
            type="button"
            variant="destructive"
          >
            {confirmLabel}
          </AdminButton>
        </AdminActionGroup>
      </div>
    </div>
  );
}
