"use client";
/* eslint-disable @next/next/no-img-element */

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { services } from "@/lib/api";
import type { AdminProduct, AdminProductImage, ProductInput } from "@/lib/types/admin";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/features/admin/products/product-schema";

type ProductValues = ProductFormValues;

const defaults: ProductValues = {
  name: "",
  slug: "",
  description: "",
  category: "pastries",
  priceAmount: 0,
  sku: "",
  stockQuantity: 0,
  availability: "in_stock",
  publicationStatus: "draft",
  tags: "",
};

export function ProductEditor({ productId }: { productId?: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null | undefined>(
    productId ? undefined : null,
  );
  const [images, setImages] = useState<AdminProductImage[]>([]);
  const [saveError, setSaveError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductValues>({ resolver: zodResolver(productFormSchema), defaultValues: defaults });
  useEffect(() => {
    if (!productId) return;
    services.admin.products.getById(productId).then((item) => {
      setProduct(item);
      if (item) {
        reset({
          name: item.name,
          slug: item.slug,
          description: item.description,
          category: item.category,
          priceAmount: item.price.amount,
          sku: item.sku,
          stockQuantity: item.stockQuantity,
          availability: item.availability,
          publicationStatus: item.publicationStatus,
          tags: item.tags.join(", "),
        });
        setImages(item.images);
      }
    });
  }, [productId, reset]);
  const onFile = async (file?: File) => {
    if (!file) return;
    const image = await services.admin.media.upload(file);
    setImages((current) => [...current, { ...image, position: current.length }]);
  };
  const submit = async (values: ProductValues) => {
    setSaveError("");
    const input: ProductInput = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      category: values.category,
      price: { amount: values.priceAmount, currency: "IDR" },
      sku: values.sku,
      stockQuantity: values.stockQuantity,
      availability: values.availability,
      publicationStatus: values.publicationStatus,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      images,
    };
    try {
      if (productId) await services.admin.products.update(productId, input);
      else await services.admin.products.create(input);
      router.push("/admin/products");
    } catch {
      setSaveError("The mock service could not save this product. Try again.");
    }
  };
  if (product === undefined)
    return (
      <div className="admin-page">
        <p>Loading product...</p>
      </div>
    );
  if (productId && !product)
    return (
      <div className="admin-page">
        <p>That product could not be found.</p>
        <Link href="/admin/products">Back to products</Link>
      </div>
    );
  return (
    <div className="admin-page">
      <Link className="admin-back-link" href="/admin/products">
        <ArrowLeft aria-hidden="true" size={18} /> Products
      </Link>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">{productId ? "Edit product" : "New product"}</p>
          <h1>{productId ? "Update the shelf label." : "Add something good."}</h1>
        </div>
      </div>
      <form className="admin-product-form" onSubmit={handleSubmit(submit)} noValidate>
        <div className="admin-form-grid">
          <label>
            Name
            <input {...register("name")} />
            {errors.name && <span>{errors.name.message}</span>}
          </label>
          <label>
            Slug
            <input {...register("slug")} />
            {errors.slug && <span>{errors.slug.message}</span>}
          </label>
          <label className="admin-form-full">
            Description
            <textarea {...register("description")} rows={4} />
            {errors.description && <span>{errors.description.message}</span>}
          </label>
          <label>
            Category
            <select {...register("category")}>
              <option value="pastries">Pastries</option>
              <option value="breads">Breads</option>
              <option value="cakes">Cakes</option>
              <option value="sweets">Sweets</option>
              <option value="beverages">Beverages</option>
              <option value="gifts">Gifts</option>
            </select>
          </label>
          <label>
            Price in IDR
            <input
              inputMode="numeric"
              {...register("priceAmount", { valueAsNumber: true })}
              type="number"
            />
            {errors.priceAmount && <span>{errors.priceAmount.message}</span>}
          </label>
          <label>
            SKU
            <input {...register("sku")} />
            {errors.sku && <span>{errors.sku.message}</span>}
          </label>
          <label>
            Stock quantity
            <input
              inputMode="numeric"
              {...register("stockQuantity", { valueAsNumber: true })}
              type="number"
            />
            {errors.stockQuantity && <span>{errors.stockQuantity.message}</span>}
          </label>
          <label>
            Availability
            <select {...register("availability")}>
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="sold_out">Sold out</option>
            </select>
          </label>
          <label>
            Publication
            <select {...register("publicationStatus")}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="admin-form-full">
            Tags
            <input {...register("tags")} placeholder="seasonal, giftable" />
          </label>
        </div>
        <section className="admin-image-manager">
          <div>
            <h2>Product images</h2>
            <p>
              Temporary local previews only. The Go API will own uploads, ordering, and durable
              URLs.
            </p>
          </div>
          <label className="admin-upload-button">
            Choose image
            <input
              accept="image/*"
              onChange={(event) => onFile(event.target.files?.[0])}
              type="file"
            />
          </label>
          <div className="admin-image-list">
            {images.map((image) => (
              <figure key={image.id}>
                <img alt={image.alt} src={image.url} />
                <button
                  aria-label={`Remove ${image.alt}`}
                  onClick={() =>
                    setImages((current) => current.filter((item) => item.id !== image.id))
                  }
                  type="button"
                >
                  <Trash aria-hidden="true" size={18} />
                </button>
              </figure>
            ))}
          </div>
        </section>
        {saveError && <p className="admin-form-alert">{saveError}</p>}
        <button className="admin-save-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : productId ? "Save product" : "Create product"}
        </button>
      </form>
    </div>
  );
}
