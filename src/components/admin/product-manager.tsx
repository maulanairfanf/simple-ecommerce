"use client";

import { Archive, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { services } from "@/lib/api";
import type { AdminProduct, ProductPublicationStatus } from "@/lib/types/admin";
import type { ProductCategory } from "@/lib/types/commerce";

export function ProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProductPublicationStatus | "all">("all");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [archiveTarget, setArchiveTarget] = useState<AdminProduct | null>(null);
  const load = () =>
    services.admin.products
      .list({
        q: query,
        status: status === "all" ? undefined : status,
        category: category === "all" ? undefined : category,
      })
      .then((result) => setProducts(result.items));
  useEffect(() => {
    services.admin.products
      .list({
        q: query,
        status: status === "all" ? undefined : status,
        category: category === "all" ? undefined : category,
      })
      .then((result) => setProducts(result.items));
  }, [query, status, category]);
  const archive = async () => {
    if (!archiveTarget) return;
    await services.admin.products.archive(archiveTarget.id);
    setArchiveTarget(null);
    load();
  };
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Products</p>
          <h1>What is on the shelf.</h1>
        </div>
        <Link className="admin-primary-link" href="/admin/products/new">
          <Plus aria-hidden="true" size={18} /> Add product
        </Link>
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
      </div>
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
                  <Link className="admin-inline-link" href={`/admin/products/${product.id}/edit`}>
                    Edit
                  </Link>
                  <button
                    className="admin-archive"
                    onClick={() => setArchiveTarget(product)}
                    type="button"
                  >
                    <Archive aria-hidden="true" size={16} /> Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && (
        <div className="admin-empty">
          <p>No products match these filters.</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
              setStatus("all");
            }}
            type="button"
          >
            Clear filters
          </button>
        </div>
      )}
      {archiveTarget && (
        <div
          className="admin-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-title"
        >
          <div>
            <h2 id="archive-title">Archive {archiveTarget.name}?</h2>
            <p>
              This hides the product from future sale. The future Go API must preserve historical
              order snapshots.
            </p>
            <div>
              <button
                className="admin-secondary-button"
                onClick={() => setArchiveTarget(null)}
                type="button"
              >
                Cancel
              </button>
              <button className="admin-danger-button" onClick={archive} type="button">
                Archive product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
