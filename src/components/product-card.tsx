import type { Product } from "@/lib/types/commerce";
import { PhotoPlaceholder } from "@/components/photo-placeholder";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

export function ProductCard({ product }: { product: Product }) {
  return (
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
  );
}
