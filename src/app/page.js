
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

function ProductSection({ title, subtitle, products, loading, id }) {
  return (
    <section id={id} className="section-space scroll-mt-40">
      <div className="container-page">
        <div className="mb-7">
          <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            {subtitle}
          </p>
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white p-4"
              >
                <div className="skeleton h-28 w-full" />
                <div className="skeleton mt-4 h-5 w-3/4" />
                <div className="skeleton mt-3 h-4 w-1/2" />
                <div className="skeleton mt-5 h-8 w-full" />
              </div>
            ))}
          </div>
        ) : products.length ? (
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard
                key={product.id ?? product.slug ?? index}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
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

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/products");
        const list = getList(data, "products");

        if (active) setProducts(list);
      } catch {
        if (active) {
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (active) setLoading(false);
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

  return (
    <>
      <Hero />

      {error && (
        <div className="container-page mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 font-bold underline"
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
        products={products}
        loading={loading}
      />
    </>
  );
}