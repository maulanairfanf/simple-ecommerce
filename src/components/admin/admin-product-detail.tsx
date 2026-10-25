"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminActionLink } from "@/components/admin/admin-action";
import { services } from "@/lib/api";
import type { AdminProduct } from "@/lib/types/admin";

export function AdminProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    services.admin.products
      .getById(productId)
      .then((result) => {
        if (!cancelled) setProduct(result);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <main className="admin-page">
        <p className="admin-data-loading">Loading product...</p>
      </main>
    );
  }
  if (hasError || !product) {
    return (
      <main className="admin-page">
        <p className="admin-form-alert">Product could not be loaded.</p>
        <AdminActionLink href="/admin/products" variant="text">
          Back to products
        </AdminActionLink>
      </main>
    );
  }

  return (
    <div className="admin-page admin-product-detail">
      <Link className="admin-back-link" href="/admin/products">
        Back to products
      </Link>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Product detail</p>
          <h1>{product.name}</h1>
        </div>
        <AdminActionLink href={`/admin/products/${product.id}/edit`}>Edit product</AdminActionLink>
      </div>
      <div className="admin-product-detail-grid">
        <div className="admin-product-detail-image">
          {product.images[0] ? (
            <img alt={product.images[0].alt} src={product.images[0].url} />
          ) : (
            <span>No image</span>
          )}
        </div>
        <section className="admin-product-detail-panel" aria-label="Product information">
          <dl>
            <div>
              <dt>Slug</dt>
              <dd>{product.slug}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>Rp {product.price.amount.toLocaleString("id-ID")}</dd>
            </div>
            <div>
              <dt>Quantity</dt>
              <dd>{product.stockQuantity}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{product.availability.replaceAll("_", " ")}</dd>
            </div>
            <div>
              <dt>Publication</dt>
              <dd>{product.publicationStatus}</dd>
            </div>
          </dl>
          <h2>Description</h2>
          <p>{product.description}</p>
          {product.tags.length > 0 && (
            <p className="admin-product-detail-tags">{product.tags.join(" · ")}</p>
          )}
        </section>
      </div>
    </div>
  );
}
