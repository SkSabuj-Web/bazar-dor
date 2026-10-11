
"use client";

import { useEffect, useState } from "react";
import { apiFetch, getList, formatPrice } from "@/lib/api";

function getName(product) {
  return product.nameBn || product.name || product.title || "পণ্য";
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

function getEmoji(product) {
  return product.image || product.categoryIcon || "🛒";
}

export default function PriceTicker() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await apiFetch("/products");
        const list = getList(data, "products");

        if (active) setProducts(list);
      } catch (error) {
        console.error("Ticker API error:", error);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  if (!products.length) {
    return (
      <div className="overflow-hidden bg-green-950 py-4 text-white">
        <p className="text-center text-sm">
          আজকের বাজারদর লোড হচ্ছে...
        </p>
      </div>
    );
  }

  const tickerProducts = [...products, ...products];

  return (
    <div className="overflow-hidden border-b border-green-900 bg-green-950 text-white">
      <div className="ticker-track items-center">
        {tickerProducts.map((product, index) => {
          const change = getChange(product);
          const isUp = product.change?.dir === "up" || (!product.change?.dir && change > 0);
          const isDown = product.change?.dir === "down" || (!product.change?.dir && change < 0);

          return (
            <div
              key={`${product.id ?? product.slug ?? index}-${index}`}
              className="flex shrink-0 items-center gap-3 px-6 py-4"
            >
              <span className="text-xl">{getEmoji(product)}</span>

              <span className="font-semibold">
                {getName(product)}
              </span>

              <span className="font-bold text-green-300">
                {formatPrice(getPrice(product))} টাকা
              </span>

              <span
                className={`text-sm font-bold ${
                  isUp
                    ? "text-green-300"
                    : isDown
                      ? "text-red-300"
                      : "text-gray-300"
                }`}
              >
                {isUp ? "▲ " : isDown ? "▼ " : "— "}
                {formatPrice(Math.abs(change))}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
