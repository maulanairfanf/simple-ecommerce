"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useDeferredValue, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/lib/types/commerce";

type SortOrder = "featured" | "price-low" | "price-high";

export function CatalogClient({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("featured");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredProducts = products
    .filter((product) => category === "all" || product.category === category)
    .filter(
      (product) =>
        !deferredQuery ||
        `${product.name} ${product.shortDescription} ${product.category}`
          .toLowerCase()
          .includes(deferredQuery),
    )
    .toSorted((left, right) => {
      if (sort === "price-low") return left.price.amount - right.price.amount;
      if (sort === "price-high") return right.price.amount - left.price.amount;
      return 0;
    });

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
    setSort("featured");
  };

  return (
    <section className="catalog section-shell" aria-labelledby="catalog-title">
      <div className="catalog-heading">
        <div>
          <p className="section-label">The daily counter</p>
          <h1 id="catalog-title">Something lovely for right now.</h1>
        </div>
        <p>
          Today&apos;s selection is ready when you are. Product photography will arrive from the API
          as it becomes available.
        </p>
      </div>
      <div className="catalog-controls">
        <div className="catalog-search">
          <label htmlFor="catalog-search">Search the counter</label>
          <div>
            <MagnifyingGlass aria-hidden="true" size={19} />
            <input
              id="catalog-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try cake, bread, or pastry"
              value={query}
            />
          </div>
        </div>
        <label className="catalog-sort" htmlFor="catalog-sort">
          Sort by
          <select
            id="catalog-sort"
            onChange={(event) => setSort(event.target.value as SortOrder)}
            value={sort}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="category-filters" aria-label="Product category filters">
        <button
          aria-pressed={category === "all"}
          className={category === "all" ? "filter-active" : ""}
          onClick={() => setCategory("all")}
          type="button"
        >
          All bakes
        </button>
        {categories.map((item) => (
          <button
            aria-pressed={category === item.slug}
            className={category === item.slug ? "filter-active" : ""}
            key={item.id}
            onClick={() => setCategory(item.slug)}
            type="button"
          >
            {item.name}
          </button>
        ))}
      </div>
      {filteredProducts.length > 0 ? (
        <div className="product-grid catalog-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <p>Nothing on the counter matches that yet.</p>
          <button onClick={resetFilters} type="button">
            <X aria-hidden="true" size={18} /> Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
