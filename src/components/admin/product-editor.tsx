"use client";
/* eslint-disable @next/next/no-img-element */

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper, { type Area } from "react-easy-crop";
import { useForm } from "react-hook-form";
import { AdminActionLink, AdminButton } from "@/components/admin/admin-action";
import { useAdminToast } from "@/components/admin/admin-toast";
import { services } from "@/lib/api";
import type { AdminCategory, AdminProduct, ProductInput } from "@/lib/types/admin";
import { PRODUCT_PUBLICATION_STATUS } from "@/lib/types/admin";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/features/admin/products/product-schema";

type ProductValues = ProductFormValues;

async function cropImage(source: string, area: Area): Promise<File> {
  const image = new Image();
  image.src = source;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Image could not be cropped."));
  });
  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image could not be cropped.");
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.9),
  );
  if (!blob) throw new Error("Image could not be cropped.");
  return new File([blob], "product-image.jpg", { type: "image/jpeg" });
}

function ImageCropDialog({
  source,
  onCancel,
  onApply,
}: {
  source: string;
  onCancel: () => void;
  onApply: (file: File) => Promise<void>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const apply = async () => {
    if (!area) return;
    setIsApplying(true);
    try {
      await onApply(await cropImage(source, area));
    } finally {
      setIsApplying(false);
    }
  };
  return (
    <div
      aria-labelledby="crop-product-image-title"
      aria-modal="true"
      className="image-crop-dialog"
      role="dialog"
    >
      <div className="image-crop-dialog-panel">
        <div className="image-crop-dialog-heading">
          <div>
            <p className="admin-eyebrow">Product image</p>
            <h2 id="crop-product-image-title">Frame the bake.</h2>
          </div>
          <AdminButton disabled={isApplying} onClick={onCancel} type="button" variant="text">
            Cancel
          </AdminButton>
        </div>
        <div className="image-crop-stage">
          <Cropper
            aspect={4 / 3}
            crop={crop}
            image={source}
            onCropChange={setCrop}
            onCropComplete={(_, croppedAreaPixels) => setArea(croppedAreaPixels)}
            onZoomChange={setZoom}
            showGrid
            zoom={zoom}
          />
        </div>
        <label className="image-crop-zoom">
          Zoom
          <input
            max="3"
            min="1"
            onChange={(event) => setZoom(Number(event.target.value))}
            step="0.1"
            type="range"
            value={zoom}
          />
        </label>
        <AdminButton
          isLoading={isApplying}
          loadingLabel="Applying crop..."
          onClick={apply}
          type="button"
        >
          Use cropped image
        </AdminButton>
      </div>
    </div>
  );
}

const defaults: ProductValues = {
  name: "",
  slug: "",
  description: "",
  category: "",
  priceAmount: 0,
  sku: "",
  stockQuantity: 0,
  availability: "in_stock",
  publicationStatus: PRODUCT_PUBLICATION_STATUS.ACTIVE,
  tags: "",
};

export function ProductEditor({ productId }: { productId?: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null | undefined>(
    productId ? undefined : null,
  );
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [cropSource, setCropSource] = useState("");
  const [saveError, setSaveError] = useState("");
  const { notify } = useAdminToast();
  const isArchived = product?.publicationStatus === PRODUCT_PUBLICATION_STATUS.ARCHIVED;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductValues>({ resolver: zodResolver(productFormSchema), defaultValues: defaults });
  useEffect(() => {
    services.admin.categories
      .list()
      .then(setCategories)
      .catch(() => notify("Categories could not be loaded. Try again.", "error"));
  }, [notify]);
  useEffect(() => {
    if (!productId) return;
    services.admin.products
      .getById(productId)
      .then((item) => {
        setProduct(item);
        if (item) {
          reset({
            name: item.name,
            slug: item.slug,
            description: item.description,
            category: item.categoryId ?? item.category,
            priceAmount: item.price.amount,
            sku: item.sku,
            stockQuantity: item.stockQuantity,
            availability: item.availability,
            publicationStatus: item.publicationStatus,
            tags: item.tags.join(", "),
          });
          setImagePreview(item.images[0]?.url ?? "");
        }
      })
      .catch(() => {
        setProduct(null);
        notify("Product could not be loaded. Try again.", "error");
      });
  }, [notify, productId, reset]);
  const submit = async (values: ProductValues) => {
    setSaveError("");
    if ((!productId || !product?.images.length) && !imageFile) {
      setSaveError("Choose a product image before saving.");
      return;
    }
    const input: ProductInput = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      category: values.category,
      categoryId: values.category,
      price: { amount: values.priceAmount, currency: "IDR" },
      sku: values.sku,
      stockQuantity: values.stockQuantity,
      availability: values.availability,
      publicationStatus: values.publicationStatus,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      images: product?.images ?? [],
      imageFile: imageFile ?? undefined,
    };
    try {
      if (productId) await services.admin.products.update(productId, input);
      else await services.admin.products.create(input);
      notify(productId ? "Product updated." : "Product created.");
      router.push("/admin/products");
    } catch {
      setSaveError("The product could not be saved. Try again.");
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
        <AdminActionLink href="/admin/products" variant="text">
          Back to products
        </AdminActionLink>
      </div>
    );
  return (
    <div className="admin-page">
      <AdminActionLink href="/admin/products" variant="text">
        <ArrowLeft aria-hidden="true" size={18} /> Products
      </AdminActionLink>
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
              <option value="">Choose a category</option>
              {product &&
                product.categoryId &&
                !categories.some((category) => category.id === product.categoryId) && (
                  <option value={product.categoryId}>{product.category}</option>
                )}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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
            <select {...register("publicationStatus")} disabled={isArchived}>
              <option value={PRODUCT_PUBLICATION_STATUS.ACTIVE}>Active</option>
              <option value={PRODUCT_PUBLICATION_STATUS.ARCHIVED}>Archived</option>
            </select>
            {isArchived && (
              <span>Restore this product from the products list before publishing it.</span>
            )}
          </label>
          <label className="admin-form-full">
            Tags
            <input {...register("tags")} placeholder="seasonal, giftable" />
          </label>
          <label className="admin-form-full">
            Product image{!productId && " *"}
            <input
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                if (file && file.size > 5 * 1024 * 1024) {
                  setImageFile(null);
                  setSaveError("Image must be 5 MB or smaller.");
                  event.currentTarget.value = "";
                  return;
                }
                if (file) {
                  setSaveError("");
                  setCropSource(URL.createObjectURL(file));
                }
              }}
              required={!productId || !product?.images.length}
              type="file"
            />
          </label>
        </div>
        <section className="admin-image-manager">
          <div>
            <h2>Product images</h2>
            <p>{imageFile ? "New image selected." : "Existing image will be kept on edit."}</p>
          </div>
          {imagePreview ? (
            <div className="admin-image-list">
              <figure>
                <img alt="Product preview" src={imagePreview} />
              </figure>
            </div>
          ) : (
            <p className="admin-data-loading">No product image selected.</p>
          )}
        </section>
        {saveError && <p className="admin-form-alert">{saveError}</p>}
        <AdminButton isLoading={isSubmitting} loadingLabel="Saving..." type="submit">
          {productId ? "Save product" : "Create product"}
        </AdminButton>
      </form>
      {cropSource && (
        <ImageCropDialog
          onApply={async (file) => {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setCropSource("");
          }}
          onCancel={() => setCropSource("")}
          source={cropSource}
        />
      )}
    </div>
  );
}
