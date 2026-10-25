"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, ArrowCounterClockwise, PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminActionGroup, AdminButton } from "@/components/admin/admin-action";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { useAdminToast } from "@/components/admin/admin-toast";
import { services } from "@/lib/api";
import { CATEGORY_STATUS, type AdminCategory } from "@/lib/types/admin";

const schema = z.object({
  name: z.string().min(2, "Name needs at least 2 characters."),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  status: z.enum([CATEGORY_STATUS.ACTIVE, CATEGORY_STATUS.INACTIVE]),
});
type Values = z.infer<typeof schema>;
const defaults: Values = { name: "", slug: "", status: CATEGORY_STATUS.ACTIVE };

export function CategoryManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { notify } = useAdminToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const result = await services.admin.categories.list();
        if (!cancelled) setCategories(result);
      } catch {
        if (!cancelled) notify("Categories could not be loaded. Try again.", "error");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [notify, refreshKey]);
  const edit = (category: AdminCategory) => {
    setEditing(category);
    reset({
      name: category.name,
      slug: category.slug,
      status: category.status,
    });
  };
  const submit = async (values: Values) => {
    try {
      if (editing) await services.admin.categories.update(editing.id, values);
      else await services.admin.categories.create(values);
      reset(defaults);
      setEditing(null);
      notify("Category saved.");
      setRefreshKey((current) => current + 1);
    } catch {
      notify("Category could not be saved. Try again.", "error");
    }
  };
  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await services.admin.categories.delete(deleteTarget.id);
      notify(`${deleteTarget.name} was deleted.`);
      setDeleteTarget(null);
      setRefreshKey((current) => current + 1);
    } catch {
      notify("Category could not be deleted. Try again.", "error");
    }
  };
  const changeStatus = async (category: AdminCategory) => {
    const status =
      category.status === CATEGORY_STATUS.ACTIVE
        ? CATEGORY_STATUS.INACTIVE
        : CATEGORY_STATUS.ACTIVE;
    try {
      await services.admin.categories.update(category.id, {
        name: category.name,
        slug: category.slug,
        status,
      });
      notify(
        `${category.name} was ${status === CATEGORY_STATUS.ACTIVE ? "unarchived" : "archived"}.`,
      );
      setRefreshKey((current) => current + 1);
    } catch {
      notify("Category status could not be updated. Try again.", "error");
    }
  };
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Categories</p>
          <h1>Keep the counter clear.</h1>
        </div>
        <p>
          Set a category inactive to keep it out of new use, or delete it when it is no longer
          needed.
        </p>
      </div>
      <div className="admin-two-column">
        <section className="admin-table-wrap">
          {isLoading && (
            <p className="admin-data-loading" role="status">
              Loading categories...
            </p>
          )}
          {!isLoading && categories.length === 0 && (
            <p className="admin-data-loading">
              No categories yet. Create one to organize products.
            </p>
          )}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <strong>{category.name}</strong>
                    <small>/{category.slug}</small>
                  </td>
                  <td>
                    <span
                      className={`admin-status ${category.status === CATEGORY_STATUS.ACTIVE ? "status-active" : "status-archived"}`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td>
                    <AdminActionGroup>
                      <AdminButton onClick={() => edit(category)} type="button" variant="text">
                        <PencilSimple aria-hidden="true" size={16} /> Edit
                      </AdminButton>
                      <AdminButton
                        onClick={() => void changeStatus(category)}
                        type="button"
                        variant="text"
                      >
                        {category.status === CATEGORY_STATUS.ACTIVE ? (
                          <>
                            <Archive aria-hidden="true" size={16} /> Archive
                          </>
                        ) : (
                          <>
                            <ArrowCounterClockwise aria-hidden="true" size={16} /> Unarchive
                          </>
                        )}
                      </AdminButton>
                      <AdminButton
                        onClick={() => setDeleteTarget(category)}
                        type="button"
                        variant="destructive"
                      >
                        <Trash aria-hidden="true" size={16} /> Delete
                      </AdminButton>
                    </AdminActionGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <form className="admin-category-form" onSubmit={handleSubmit(submit)} noValidate>
          <div>
            <p className="admin-eyebrow">{editing ? "Edit category" : "New category"}</p>
            <h2>{editing ? editing.name : "Add a category"}</h2>
          </div>
          <label>
            Name
            <input {...register("name")} />
            {errors.name && <span>{errors.name.message}</span>}
          </label>
          <label>
            Slug
            <input {...register("slug")} />
            {errors.slug && <span>{errors.slug.message}</span>}
          </label>
          <label>
            Status
            <select {...register("status")}>
              <option value={CATEGORY_STATUS.ACTIVE}>Active</option>
              <option value={CATEGORY_STATUS.INACTIVE}>Inactive</option>
            </select>
            {errors.status && <span>{errors.status.message}</span>}
          </label>
          <AdminActionGroup>
            <AdminButton
              isLoading={isSubmitting}
              loadingLabel={editing ? "Saving category..." : "Creating category..."}
              type="submit"
            >
              <Plus aria-hidden="true" size={18} /> {editing ? "Save category" : "Create category"}
            </AdminButton>
            {editing && (
              <AdminButton
                disabled={isSubmitting}
                onClick={() => {
                  setEditing(null);
                  reset(defaults);
                }}
                type="button"
                variant="secondary"
              >
                Cancel
              </AdminButton>
            )}
          </AdminActionGroup>
        </form>
      </div>
      {deleteTarget && (
        <AdminConfirmDialog
          confirmLabel="Delete category"
          description="This permanently removes the category. Set it inactive instead if you may need it later."
          onCancel={() => setDeleteTarget(null)}
          onConfirm={remove}
          title={`Delete ${deleteTarget.name}?`}
        />
      )}
    </div>
  );
}
