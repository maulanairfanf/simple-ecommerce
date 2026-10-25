import type { Product } from "@/lib/types/commerce";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import Link from "next/link";

function formatPrice(amount: number, currency: string) {
  const locale = currency === "IDR" ? "id-ID" : "en-US";
  const value = currency === "IDR" ? amount : amount / 100;
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    style: "currency",
    currency,
  }).format(value);
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card-link" href={`/shop/${product.slug}`}>
      <article className="product-card">
        <PhotoPlaceholder
          brief={product.photoBrief}
          imageAlt={product.imageAlt}
          imageUrl={product.imageUrl}
          palette={product.palette}
          className="product-photo"
        />
        <div className="product-copy">
          <p className="product-category">{product.category.replaceAll("_", " ")}</p>
          <div className="product-title-row">
            <h3>{product.name}</h3>
            <p>{formatPrice(product.price.amount, product.price.currency)}</p>
          </div>
          <p className="product-description">{product.shortDescription}</p>
        </div>
      </article>
    </Link>
  );
}
