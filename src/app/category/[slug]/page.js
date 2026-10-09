"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { apiFetch, getList } from "@/lib/api";

const categories = {
chal: { name: "চাল", icon: "🍚" },
dal: { name: "ডাল", icon: "🫘" },
sobji: { name: "সবজি", icon: "🥬" },
"fish-meat": { name: "মাছ ও মাংস", icon: "🐟" },
"oil-spices": { name: "তেল ও মসলা", icon: "🌶️" },
};

function CategoryContent() {
const { slug } = useParams();
const category = categories[slug];

const [products, setProducts] = useState([]);
const [sort, setSort] = useState("default");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
if (!slug || !category) {
setProducts([]);
setLoading(false);
return;
}


let active = true;

async function loadProducts() {
  setLoading(true);
  setError("");

  try {
    const data = await apiFetch(
      `/products?category=${encodeURIComponent(slug)}`
    );

    const list = getList(data, "products");

    if (active) {
      setProducts(
        list.filter(
          (product) => product.category === slug
        )
      );
    }
  } catch {
    if (active) {
      setProducts([]);
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


}, [slug, category]);

const sortedProducts = useMemo(() => {
const result = [...products];


if (sort === "low") {
  result.sort(
    (a, b) => Number(a.today) - Number(b.today)
  );
}

if (sort === "high") {
  result.sort(
    (a, b) => Number(b.today) - Number(a.today)
  );
}

return result;


}, [products, sort]);

if (!category) {
return ( <section className="container-page py-20 text-center"> <div className="text-6xl">🔎</div>


    <h1 className="mt-4 text-3xl font-black">
      বিভাগ পাওয়া যায়নি
    </h1>

    <p className="mt-3 text-gray-500">
      সঠিক বিভাগ নির্বাচন করে আবার চেষ্টা করুন।
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

return ( <section className="container-page section-space"> <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"> <div> <p className="font-semibold text-green-700">
🛒 বাজার দর </p>


      <h1 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
        {category.icon} {category.name}
      </h1>

      <p className="mt-2 text-gray-500">
        এই বিভাগের পণ্যের বর্তমান দাম দেখুন।
      </p>
    </div>

    <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
      দাম অনুযায়ী সাজান

      <select
        value={sort}
        onChange={(event) => setSort(event.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
      >
        <option value="default">ডিফল্ট</option>
        <option value="low">দাম: কম থেকে বেশি</option>
        <option value="high">দাম: বেশি থেকে কম</option>
      </select>
    </label>
  </div>

  {error ? (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
      <p>{error}</p>

      <button
        onClick={() => window.location.reload()}
        className="mt-3 font-bold underline"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  ) : loading ? (
    <div className="product-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-4"
        >
          <div className="skeleton h-32 w-full" />
          <div className="skeleton mt-4 h-5 w-3/4" />
          <div className="skeleton mt-3 h-4 w-1/2" />
          <div className="skeleton mt-5 h-8 w-full" />
        </div>
      ))}
    </div>
  ) : sortedProducts.length ? (
    <>
      <p className="mb-5 text-sm text-gray-500">
        মোট {sortedProducts.length}টি পণ্য
      </p>

      <div className="product-grid">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id ?? product.slug}
            product={product}
          />
        ))}
      </div>
    </>
  ) : (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p className="text-lg font-bold text-gray-800">
        এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
      </p>

      <Link
        href="/"
        className="mt-4 inline-block font-bold text-green-700 hover:underline"
      >
        সব পণ্য দেখুন →
      </Link>
    </div>
  )}
</section>


);
}

function CategoryLoading() {
return ( <section className="container-page py-12"> <div className="skeleton h-8 w-48" />


  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="skeleton h-48 rounded-2xl"
      />
    ))}
  </div>
</section>


);
}

export default function CategoryPage() {
return (
<Suspense fallback={<CategoryLoading />}> <CategoryContent /> </Suspense>
);
}
