"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { services } from "@/lib/api";
import type { AdminCategory } from "@/lib/types/admin";

const schema = z.object({
  name: z.string().min(2, "Name needs at least 2 characters."),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  description: z.string().min(8, "Description needs at least 8 characters."),
  imageUrl: z.string().url("Enter a valid image URL.").or(z.literal("")),
  active: z.boolean(),
});
type Values = z.infer<typeof schema>;
const defaults: Values = { name: "", slug: "", description: "", imageUrl: "", active: true };

export function CategoryManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
  const load = () => services.admin.categories.list().then(setCategories);
  useEffect(() => {
    load();
  }, []);
  const edit = (category: AdminCategory) => {
    setEditing(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl ?? "",
      active: category.active,
    });
  };
  const submit = async (values: Values) => {
    const input = { ...values, imageUrl: values.imageUrl || undefined };
    if (editing) await services.admin.categories.update(editing.id, input);
    else await services.admin.categories.create(input);
    reset(defaults);
    setEditing(null);
    setMessage("Category saved.");
    load();
  };
  const archive = async (category: AdminCategory) => {
    if (!window.confirm(`Archive ${category.name}? Products must be moved first.`)) return;
    try {
      await services.admin.categories.archive(category.id);
      setMessage("Category archived.");
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not archive category.");
    }
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
                    <button className="admin-archive" onClick={() => edit(category)} type="button">
                      <PencilSimple aria-hidden="true" size={16} /> Edit
                    </button>
                    <button
                      className="admin-archive"
                      onClick={() => archive(category)}
                      type="button"
                    >
                      <Trash aria-hidden="true" size={16} /> Archive
                    </button>
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
          <label className="admin-checkbox">
            <input {...register("active")} type="checkbox" /> Active category
          </label>
          {message && <p className="admin-form-alert">{message}</p>}
          <div>
            <button className="admin-save-button" disabled={isSubmitting} type="submit">
              <Plus aria-hidden="true" size={18} /> {editing ? "Save category" : "Create category"}
            </button>
            {editing && (
              <button
                className="admin-secondary-button"
                onClick={() => {
                  setEditing(null);
                  reset(defaults);
                }}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
