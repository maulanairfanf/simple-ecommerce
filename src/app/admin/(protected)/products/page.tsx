import { ProductManager } from "@/components/admin/product-manager";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ availability?: string }>;
}) {
  const params = await searchParams;
  const initialAvailability = params.availability === "low_stock" ? "low_stock" : "all";
  return <ProductManager initialAvailability={initialAvailability} key={initialAvailability} />;
}
