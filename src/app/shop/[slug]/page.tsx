/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { services } from "@/lib/api";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await services.products.getBySlug(slug);
    return product
      ? { description: product.description, title: `${product.name} | Daily Crumb` }
      : { title: "Product not found | Daily Crumb" };
  } catch {
    return { title: "Product | Daily Crumb" };
  }
}

export default async function PublicProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    product = await services.products.getBySlug(slug);
  } catch {
    notFound();
  }
  if (!product) notFound();

  return (
    <main>
      <SiteHeader />
      <article className="product-detail-page section-shell">
        <Link className="product-detail-back" href="/shop">
          Back to the counter
        </Link>
        <div className="product-detail-grid">
          <div className="product-detail-image">
            {product.imageUrl ? (
              <img alt={product.name} src={product.imageUrl} />
            ) : (
              <span>No image available</span>
            )}
          </div>
          <div className="product-detail-copy">
            <p className="section-label">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-price">{formatPrice(product.price.amount)}</p>
            <p className="product-detail-description">{product.description}</p>
            <p className={`product-detail-stock stock-${product.availability}`}>
              {product.availability === "sold_out"
                ? "Sold out"
                : `${product.quantity} available today`}
            </p>
            {product.tags.length > 0 && (
              <ul className="product-detail-tags" aria-label="Product tags">
                {product.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
            <p className="product-detail-note">
              Online ordering is coming soon. Visit the counter to reserve this bake.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
