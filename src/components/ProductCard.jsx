
import Link from "next/link";
import { formatPrice } from "@/lib/api";

function getProductName(product) {
  return product.nameBn || product.name || product.title || "পণ্য";
}

function getEmoji(product) {
  if (product.image) return product.image;

  const category = String(product.category || "").toLowerCase();

  const emojiMap = {
    chal: "🍚",
    dal: "🫘",
    sobji: "🥬",
    vegetable: "🥬",
    fish: "🐟",
    meat: "🍗",
    oil: "🫙",
  };

  return emojiMap[category] || product.categoryIcon || "🛒";
}

function getPrice(product) {
  return Number(product.today ?? product.price ?? 0);
}

function getChange(product) {
  return Number(
    product.change?.pct ??
    product.priceChangePercent ??
    product.changePercent ??
    0
  );
}

function getSlug(product) {
  return product.slug || product.id || product._id;
}

function getUnit(unit) {
  const units = {
    kg: "প্রতি কেজি",
    gram: "প্রতি গ্রাম",
    liter: "প্রতি লিটার",
    piece: "প্রতি পিস",
  };

  return units[unit] || unit || "প্রতি কেজি";
}

export default function ProductCard({ product }) {
  const name = getProductName(product);
  const price = getPrice(product);
  const change = getChange(product);
  const direction = product.change?.dir;
  const isUp = direction ? direction === "up" : change > 0;
  const isDown = direction ? direction === "down" : change < 0;
  const slug = getSlug(product);

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg sm:p-5"
    >
      <div className="flex min-h-24 items-center justify-center rounded-xl bg-green-50 text-5xl transition group-hover:bg-green-100 sm:min-h-32 sm:text-6xl">
        {getEmoji(product)}
      </div>

      <div className="mt-4 flex-1">
        <h3 className="line-clamp-2 font-bold leading-6 text-gray-900">
          {name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {getUnit(product.unit)}
        </p>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500">আজকের দাম</p>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <p className="text-lg font-black text-green-800">
            {formatPrice(price)} <span className="text-xs">টাকা</span>
          </p>

          <span
            className={`rounded-full px-2 py-1 text-xs font-bold ${
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
    </Link>
  );
}