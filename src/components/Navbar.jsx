"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { name: "সব পণ্য", slug: "all" },
  { name: "চাল", slug: "chal" },
  { name: "ডাল", slug: "dal" },
  { name: "সবজি", slug: "sobji" },
  { name: "মাছ ও মাংস", slug: "fish-meat" },
  { name: "তেল ও মসলা", slug: "oil-spices" },
];

function NavbarContent() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const formattedDate = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    setCurrentDate(formattedDate);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur">
      <div className="container-page">
        <div className="flex min-h-[82px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              🛒
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight text-green-800 sm:text-2xl">
                বাজার দর
              </span>

              <span className="block text-xs text-gray-500">
                {currentDate}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/signin"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              সাইন আপ
            </Link>
          </div>
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto pb-3">
          {categories.map((category) => {
            const href =
              category.slug === "all"
                ? "/"
                : `/category/${category.slug}`;

            const active =
              category.slug === "all"
                ? pathname === "/"
                : pathname === href;

            return (
              <Link
                key={category.slug}
                href={href}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-800"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-2 pb-3 sm:hidden">
          <Link
            href="/signin"
            className="flex-1 rounded-xl border border-green-200 py-2 text-center text-sm font-semibold text-green-800"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="flex-1 rounded-xl bg-green-700 py-2 text-center text-sm font-semibold text-white"
          >
            সাইন আপ
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95">
          <div className="container-page min-h-[82px]" />
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}