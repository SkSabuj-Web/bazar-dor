
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

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
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");

  const { data: session, isPending } = authClient.useSession();

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

  async function handleLogout() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "লগআউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে লগআউট হয়েছে");
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    }
  }

  function AuthLinks({ mobile = false }) {
    const linkStyle = mobile
      ? "rounded-lg px-4 py-2 text-sm font-semibold"
      : "rounded-xl px-4 py-2 text-sm font-semibold";

    if (isPending) {
      return (
        <span className="px-3 py-2 text-sm text-gray-500">
          অপেক্ষা করুন...
        </span>
      );
    }

    if (session) {
      return (
        <>
          <Link
            href="/profile"
            className={`${linkStyle} border border-green-600 text-green-800 hover:bg-green-50`}
          >
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`${linkStyle} bg-red-600 text-white hover:bg-red-700`}
          >
            লগআউট
          </button>
        </>
      );
    }

    return (
      <>
        <Link
          href="/signin"
          className={`${linkStyle} text-green-800 hover:bg-green-50`}
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className={`${linkStyle} bg-green-700 text-white hover:bg-green-800`}
        >
          সাইন আপ
        </Link>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur">
      <div className="container-page">
        <div className="flex min-h-[82px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
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
            <AuthLinks />
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

        <div className="flex flex-wrap items-center gap-2 pb-3 sm:hidden">
          <AuthLinks mobile />
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
