"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, ArrowCounterClockwise, PencilSimple, Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminActionGroup, AdminButton } from "@/components/admin/admin-action";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { useAdminToast } from "@/components/admin/admin-toast";
import { services } from "@/lib/api";
import type { AdminCategory } from "@/lib/types/admin";

const schema = z.object({
  name: z.string().min(2, "Name needs at least 2 characters."),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  description: z.string().min(8, "Description needs at least 8 characters."),
  imageUrl: z.string().url("Enter a valid image URL.").or(z.literal("")),
});
type Values = z.infer<typeof schema>;
const defaults: Values = { name: "", slug: "", description: "", imageUrl: "" };

export function CategoryManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AdminCategory | null>(null);
  const [unarchiveTarget, setUnarchiveTarget] = useState<AdminCategory | null>(null);
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
      description: category.description,
      imageUrl: category.imageUrl ?? "",
    });
  };
  const submit = async (values: Values) => {
    const input = {
      ...values,
      active: editing ? editing.active : true,
      imageUrl: values.imageUrl || undefined,
    };
    try {
      if (editing) await services.admin.categories.update(editing.id, input);
      else await services.admin.categories.create(input);
      reset(defaults);
      setEditing(null);
      notify("Category saved.");
      setRefreshKey((current) => current + 1);
    } catch {
      notify("Category could not be saved. Try again.", "error");
    }
  };
  const archive = async () => {
    if (!archiveTarget) return;
    await services.admin.categories.archive(archiveTarget.id);
    notify(`${archiveTarget.name} was archived.`);
    setArchiveTarget(null);
    setRefreshKey((current) => current + 1);
  };
  const unarchive = async () => {
    if (!unarchiveTarget) return;
    await services.admin.categories.unarchive(unarchiveTarget.id);
    notify(`${unarchiveTarget.name} was restored.`);
    setUnarchiveTarget(null);
    setRefreshKey((current) => current + 1);
  };
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Categories</p>
          <h1>Keep the counter clear.</h1>
        </div>
        <p>Archive only empty categories. Your Go backend will enforce reassignment rules.</p>
      </div>
      <div className="admin-two-column">
        <section className="admin-table-wrap">
          {isLoading && (
            <p className="admin-data-loading" role="status">
              Loading categories...
            </p>
          )}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Products</th>
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
                  <td>{category.productCount}</td>
                  <td>
                    <span
                      className={`admin-status ${category.active ? "status-active" : "status-archived"}`}
                    >
                      {category.active ? "active" : "archived"}
                    </span>
                  </td>
                  <td>
                    <AdminActionGroup>
                      <AdminButton onClick={() => edit(category)} type="button" variant="text">
                        <PencilSimple aria-hidden="true" size={16} /> Edit
                      </AdminButton>
                      {category.active ? (
                        <AdminButton
                          onClick={() => setArchiveTarget(category)}
                          type="button"
                          variant="text"
                        >
                          <Archive aria-hidden="true" size={16} /> Archive
                        </AdminButton>
                      ) : (
                        <AdminButton
                          onClick={() => setUnarchiveTarget(category)}
                          type="button"
                          variant="text"
                        >
                          <ArrowCounterClockwise aria-hidden="true" size={16} /> Unarchive
                        </AdminButton>
                      )}
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
            Description
            <textarea {...register("description")} rows={3} />
            {errors.description && <span>{errors.description.message}</span>}
          </label>
          <label>
            Image URL <input {...register("imageUrl")} />
            {errors.imageUrl && <span>{errors.imageUrl.message}</span>}
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
      {archiveTarget && (
        <AdminConfirmDialog
          confirmLabel="Archive category"
          description="Products must be moved first. This category will no longer be available for new products."
          onCancel={() => setArchiveTarget(null)}
          onConfirm={archive}
          title={`Archive ${archiveTarget.name}?`}
        />
      )}
      {unarchiveTarget && (
        <AdminConfirmDialog
          confirmLabel="Unarchive category"
          description="This category will become available for new products again."
          onCancel={() => setUnarchiveTarget(null)}
          onConfirm={unarchive}
          title={`Unarchive ${unarchiveTarget.name}?`}
        />
      )}
    </div>
  );
}
