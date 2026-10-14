"use client";

import {
  Archive,
  ArrowCounterClockwise,
  MagnifyingGlass,
  PencilSimple,
  Plus,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { AdminActionGroup, AdminActionLink, AdminButton } from "@/components/admin/admin-action";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { useAdminToast } from "@/components/admin/admin-toast";
import { services } from "@/lib/api";
import type { AdminProduct, ProductPublicationStatus } from "@/lib/types/admin";
import type { Availability, ProductCategory } from "@/lib/types/commerce";

export function ProductManager({
  initialAvailability = "all",
}: {
  initialAvailability?: Availability | "all";
}) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProductPublicationStatus | "all">("all");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [availability, setAvailability] = useState<Availability | "all">(initialAvailability);
  const [archiveTarget, setArchiveTarget] = useState<AdminProduct | null>(null);
  const [unarchiveTarget, setUnarchiveTarget] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { notify } = useAdminToast();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const result = await services.admin.products.list({
          q: query,
          status: status === "all" ? undefined : status,
          category: category === "all" ? undefined : category,
          availability: availability === "all" ? undefined : availability,
        });
        if (!cancelled) setProducts(result.items);
      } catch {
        if (!cancelled) notify("Products could not be loaded. Try again.", "error");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [availability, category, notify, query, refreshKey, status]);

  const archive = async () => {
    if (!archiveTarget) return;
    await services.admin.products.archive(archiveTarget.id);
    notify(`${archiveTarget.name} was archived.`);
    setArchiveTarget(null);
    setRefreshKey((current) => current + 1);
  };
  const unarchive = async () => {
    if (!unarchiveTarget) return;
    await services.admin.products.unarchive(unarchiveTarget.id);
    notify(`${unarchiveTarget.name} was restored as a draft.`);
    setUnarchiveTarget(null);
    setRefreshKey((current) => current + 1);
  };
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Products</p>
          <h1>What is on the shelf.</h1>
        </div>
        <AdminActionLink href="/admin/products/new">
          <Plus aria-hidden="true" size={18} /> Add product
        </AdminActionLink>
      </div>
      <div className="admin-toolbar">
        <label className="admin-search">
          <MagnifyingGlass aria-hidden="true" size={18} />
          <span className="sr-only">Search products</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product or SKU"
            value={query}
          />
        </label>
        <label>
          Category
          <select
            onChange={(event) => setCategory(event.target.value as ProductCategory | "all")}
            value={category}
          >
            <option value="all">All categories</option>
            <option value="pastries">Pastries</option>
            <option value="breads">Breads</option>
            <option value="cakes">Cakes</option>
            <option value="sweets">Sweets</option>
            <option value="beverages">Beverages</option>
            <option value="gifts">Gifts</option>
          </select>
        </label>
        <label>
          Status
          <select
            onChange={(event) => setStatus(event.target.value as ProductPublicationStatus | "all")}
            value={status}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label>
          Availability
          <select
            onChange={(event) => setAvailability(event.target.value as Availability | "all")}
            value={availability}
          >
            <option value="all">All availability</option>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="sold_out">Sold out</option>
          </select>
        </label>
      </div>
      {isLoading && (
        <p className="admin-data-loading" role="status">
          Loading products...
        </p>
      )}
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Updated</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.sku}</small>
                </td>
                <td>{product.category}</td>
                <td>Rp {product.price.amount.toLocaleString("id-ID")}</td>
                <td>
                  <span className={`admin-status status-${product.availability}`}>
                    {product.stockQuantity} · {product.availability.replaceAll("_", " ")}
                  </span>
                </td>
                <td>
                  <span className={`admin-status status-${product.publicationStatus}`}>
                    {product.publicationStatus}
                  </span>
                </td>
                <td>
                  {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
                    new Date(product.updatedAt),
                  )}
                </td>
                <td>
                  <AdminActionGroup>
                    <AdminActionLink href={`/admin/products/${product.id}/edit`} variant="text">
                      <PencilSimple aria-hidden="true" size={16} /> Edit
                    </AdminActionLink>
                    {product.publicationStatus === "archived" ? (
                      <AdminButton
                        onClick={() => setUnarchiveTarget(product)}
                        type="button"
                        variant="text"
                      >
                        <ArrowCounterClockwise aria-hidden="true" size={16} /> Unarchive
                      </AdminButton>
                    ) : (
                      <AdminButton
                        onClick={() => setArchiveTarget(product)}
                        type="button"
                        variant="text"
                      >
                        <Archive aria-hidden="true" size={16} /> Archive
                      </AdminButton>
                    )}
                  </AdminActionGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isLoading && products.length === 0 && (
        <div className="admin-empty">
          <p>No products match these filters.</p>
          <AdminButton
            onClick={() => {
              setQuery("");
              setCategory("all");
              setStatus("all");
              setAvailability("all");
            }}
            type="button"
            variant="secondary"
          >
            Clear filters
          </AdminButton>
        </div>
      )}
      {archiveTarget && (
        <AdminConfirmDialog
          confirmLabel="Archive product"
          description="This hides the product from future sale. The future Go API must preserve historical order snapshots."
          onCancel={() => setArchiveTarget(null)}
          onConfirm={archive}
          title={`Archive ${archiveTarget.name}?`}
        />
      )}
      {unarchiveTarget && (
        <AdminConfirmDialog
          confirmLabel="Unarchive product"
          description="The product will be restored as a draft. Review its price, stock, and content before publishing it again."
          onCancel={() => setUnarchiveTarget(null)}
          onConfirm={unarchive}
          title={`Unarchive ${unarchiveTarget.name}?`}
        />
      )}
    </div>
  );
}
