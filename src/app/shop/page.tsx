import { CatalogClient } from "@/components/catalog-client";
import { SiteHeader } from "@/components/site-header";
import { services } from "@/lib/api";

export const metadata = { title: "Shop | Daily Crumb" };

export default async function ShopPage() {
  const [featured, freshToday] = await Promise.all([
    services.products.getFeatured(),
    services.products.getFreshToday(),
  ]);
  const categories = await services.categories.getAll().catch(() => []);
  const products = Array.from(
    new Map([...featured, ...freshToday].map((product) => [product.id, product])).values(),
  );

  return (
    <main>
      <SiteHeader />
      <CatalogClient categories={categories} products={products} />
    </main>
  );
}
