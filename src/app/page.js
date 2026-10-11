"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { apiFetch, getList } from "@/lib/api";

function getName(product) {
  return product.nameBn || product.name || product.title || "পণ্য";
}

function getChange(product) {
  return Number(
    product.change?.pct ??
      product.priceChangePercent ??
      product.changePercent ??
      0
  );
}

function getPrice(product) {
  return Number(
    product.today ??
      product.todayPrice ??
      product.price ??
      product.currentPrice ??
      0
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  loading,
  id,
  sortBy,
  onSortChange,
  showSorting = false,
}) {
  return (
    <section id={id} className="section-space scroll-mt-40">
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3 sm:mb-7">
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-2xl font-black text-gray-900 sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>

        {showSorting && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
              পণ্যের তালিকা
            </h3>

            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value)}
              aria-label="পণ্য সাজানোর নিয়ম"
              className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:w-auto sm:min-w-52"
            >
              <option value="default">ডিফল্ট ক্রম</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
              <option value="change-high">
                দামের পরিবর্তন: বেশি আগে
              </option>
            </select>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4"
              >
                <div className="skeleton aspect-[4/3] w-full" />
                <div className="skeleton mt-4 h-5 w-3/4" />
                <div className="skeleton mt-3 h-4 w-1/2" />
                <div className="skeleton mt-5 h-8 w-full" />
              </div>
            ))}
          </div>
        ) : products.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id ?? product.slug ?? index}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm leading-6 text-gray-500 sm:p-8 sm:text-base">
            এই বিভাগে দেখানোর মতো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/products");
        const list = getList(data, "products");

        if (active) {
          setProducts(list);
        }
      } catch {
        if (active) {
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const risers = [...products]
    .filter((product) => getChange(product) > 0)
    .sort((a, b) => getChange(b) - getChange(a))
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => getChange(product) < 0)
    .sort((a, b) => getChange(a) - getChange(b))
    .slice(0, 6);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") {
      return getPrice(a) - getPrice(b);
    }

    if (sortBy === "price-high") {
      return getPrice(b) - getPrice(a);
    }

    if (sortBy === "change-high") {
      return getChange(b) - getChange(a);
    }

    return 0;
  });

  return (
    <>
      <Hero />

      {error && (
        <div className="container-page mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm leading-6 sm:text-base">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-red-200 px-4 py-2 font-bold underline underline-offset-4 sm:w-auto"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      <ProductSection
        title="আজ দাম বেড়েছে ▲"
        subtitle="যেসব পণ্যের দাম বেড়েছে, সেগুলো এক নজরে দেখুন।"
        products={risers}
        loading={loading}
      />

      <div className="border-y border-gray-100 bg-white">
        <ProductSection
          title="আজ দাম কমেছে ▼"
          subtitle="যেসব পণ্যের দাম কমেছে, সেগুলো দেখে নিন।"
          products={fallers}
          loading={loading}
        />
      </div>

      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle="নিত্যপ্রয়োজনীয় পণ্যের দাম ও পরিবর্তনের তথ্য দেখুন।"
        products={sortedProducts}
        loading={loading}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showSorting
      />
    </>
  );
}