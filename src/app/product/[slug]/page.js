"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, getList, formatPrice } from "@/lib/api";

function getUnit(unit) {
  const units = {
    kg: "কেজি",
    gram: "গ্রাম",
    liter: "লিটার",
    piece: "পিস",
  };

  return units[unit] || unit || "কেজি";
}

function PriceHistory({ label, price }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-black text-gray-900">
        {formatPrice(price)} টাকা
      </p>
    </div>
  );
}

function LoadingDetails() {
  return (
    <div className="container-page section-space">
      <div className="skeleton h-8 w-40" />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="skeleton min-h-72 rounded-2xl" />

        <div>
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton mt-4 h-5 w-1/3" />
          <div className="skeleton mt-8 h-20 w-full" />
          <div className="skeleton mt-4 h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

function ProductDetailsContent() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/products");
        const products = getList(data, "products");

        const found = products.find(
          (item) =>
            String(item.slug) === String(slug) ||
            String(item.id) === String(slug) ||
            String(item._id) === String(slug)
        );

        if (active) {
          setProduct(found || null);
        }
      } catch {
        if (active) {
          setError("পণ্যের তথ্য লোড করা যায়নি।");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <LoadingDetails />;
  }

  if (error || !product) {
    return (
      <section className="container-page py-20 text-center">
        <div className="text-6xl">🔎</div>

        <h1 className="mt-4 text-2xl font-black text-gray-900">
          {error ? "সমস্যা হয়েছে" : "পণ্যটি পাওয়া যায়নি"}
        </h1>

        <p className="mt-3 text-gray-500">
          {error || "পণ্যের লিংকটি সঠিক কি না যাচাই করুন।"}
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    );
  }

  const change = Number(product.change?.pct ?? 0);
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const unit = getUnit(product.unit);

  return (
    <section className="container-page section-space">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:underline"
      >
        ← সব পণ্যে ফিরে যান
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="flex min-h-72 items-center justify-center rounded-3xl bg-green-50 p-10">
          <span className="text-8xl sm:text-9xl">
            {product.image || product.categoryIcon || "🛒"}
          </span>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
            <span>{product.categoryIcon || "🛒"}</span>
            <span>
              {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black text-gray-900 sm:text-4xl">
            {product.nameBn || product.name || "পণ্য"}
          </h1>

          <p className="mt-2 text-gray-500">প্রতি {unit}</p>

          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
            <p className="text-sm text-gray-600">আজকের গড় দাম</p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-black text-green-800">
                {formatPrice(product.today)} টাকা
              </p>

              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  isUp
                    ? "bg-green-100 text-green-800"
                    : isDown
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {isUp ? "▲ " : isDown ? "▼ " : "— "}
                {formatPrice(Math.abs(change))}%
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <PriceHistory
              label="গতকালের দাম"
              price={product.yesterday}
            />

            <PriceHistory
              label="গত সপ্তাহের দাম"
              price={product.lastWeek}
            />

            <PriceHistory
              label="গত মাসের দাম"
              price={product.lastMonth}
            />

            <PriceHistory
              label="আজকের দাম"
              price={product.today}
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-5">
          <h2 className="text-2xl font-black text-gray-900">
            🏪 বাজারভিত্তিক দাম
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            বিভিন্ন বাজারে {product.nameBn || "এই পণ্যের"} দামের তুলনা।
          </p>
        </div>

        {product.markets?.length ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
            <table className="w-full min-w-[520px] text-left">
              <thead className="bg-green-50 text-sm text-gray-700">
                <tr>
                  <th className="px-5 py-4 font-bold">বাজার</th>
                  <th className="px-5 py-4 font-bold">বিভাগ</th>
                  <th className="px-5 py-4 font-bold">সর্বনিম্ন</th>
                  <th className="px-5 py-4 font-bold">সর্বোচ্চ</th>
                </tr>
              </thead>

              <tbody>
                {product.markets.map((market, index) => (
                  <tr
                    key={`${market.market}-${index}`}
                    className="border-t border-gray-100 text-sm"
                  >
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {market.market}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {market.division}
                    </td>

                    <td className="px-5 py-4 font-bold text-green-800">
                      {formatPrice(market.min)} টাকা
                    </td>

                    <td className="px-5 py-4 font-bold text-gray-900">
                      {formatPrice(market.max)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-6 text-gray-500">
            এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </div>
        )}
      </div>

      <p className="mt-6 text-xs leading-6 text-gray-500">
        দ্রষ্টব্য: প্রদর্শিত দাম সম্ভাব্য। বাজার ও সময় অনুযায়ী প্রকৃত দাম পরিবর্তিত হতে পারে।
      </p>
    </section>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<LoadingDetails />}>
      <ProductDetailsContent />
    </Suspense>
  );
}