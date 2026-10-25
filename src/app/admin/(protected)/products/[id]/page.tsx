import { AdminProductDetail } from "@/components/admin/admin-product-detail";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminProductDetail productId={id} />;
}
