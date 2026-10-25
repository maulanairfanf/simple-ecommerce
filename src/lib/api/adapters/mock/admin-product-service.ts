import type { AdminProductService } from "@/lib/api/contracts/admin-product-service";
import { adminProducts } from "@/lib/api/adapters/mock/admin-data";
import { PRODUCT_PUBLICATION_STATUS } from "@/lib/types/admin";

export const mockAdminProductService: AdminProductService = {
  async list(query = {}) {
    const source = adminProducts
      .filter((product) => {
        const matchesQuery =
          !query.q ||
          `${product.name} ${product.sku}`.toLowerCase().includes(query.q.toLowerCase());
        return (
          matchesQuery &&
          (!query.category || product.category === query.category) &&
          (!query.availability || product.availability === query.availability) &&
          (!query.status || product.publicationStatus === query.status)
        );
      })
      .toSorted((a, b) =>
        query.sort === "price-low"
          ? a.price.amount - b.price.amount
          : query.sort === "price-high"
            ? b.price.amount - a.price.amount
            : b.updatedAt.localeCompare(a.updatedAt),
      );
    const pageSize = query.pageSize ?? 10;
    const page = query.page ?? 1;
    return {
      items: source.slice((page - 1) * pageSize, page * pageSize),
      pagination: {
        page,
        pageSize,
        total: source.length,
        totalPages: Math.max(1, Math.ceil(source.length / pageSize)),
      },
    };
  },
  async getById(id) {
    return adminProducts.find((product) => product.id === id) ?? null;
  },
  async create(input) {
    const product = { ...input, id: `prd_mock_${Date.now()}`, updatedAt: new Date().toISOString() };
    adminProducts.unshift(product);
    return product;
  },
  async update(id, input) {
    const index = adminProducts.findIndex((product) => product.id === id);
    if (index < 0) throw new Error("Product not found");
    if (
      (adminProducts[index].publicationStatus === PRODUCT_PUBLICATION_STATUS.ARCHIVED &&
        input.publicationStatus !== PRODUCT_PUBLICATION_STATUS.ARCHIVED) ||
      (adminProducts[index].publicationStatus !== PRODUCT_PUBLICATION_STATUS.ARCHIVED &&
        input.publicationStatus === PRODUCT_PUBLICATION_STATUS.ARCHIVED)
    ) {
      throw new Error("Use the archive or unarchive action to change archived status");
    }
    const product = { ...input, id, updatedAt: new Date().toISOString() };
    adminProducts[index] = product;
    return product;
  },
  async archive(id) {
    const product = adminProducts.find((item) => item.id === id);
    if (!product) throw new Error("Product not found");
    product.publicationStatus = PRODUCT_PUBLICATION_STATUS.ARCHIVED;
    product.updatedAt = new Date().toISOString();
  },
  async unarchive(id) {
    const product = adminProducts.find((item) => item.id === id);
    if (!product) throw new Error("Product not found");
    product.publicationStatus = PRODUCT_PUBLICATION_STATUS.ACTIVE;
    product.updatedAt = new Date().toISOString();
  },
  async delete(id) {
    const index = adminProducts.findIndex((product) => product.id === id);
    if (index < 0) throw new Error("Product not found");
    adminProducts.splice(index, 1);
  },
};
