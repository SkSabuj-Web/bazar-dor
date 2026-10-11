
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const callbackURL = searchParams.get("callbackURL") || "/";
      const safeCallbackURL =
        callbackURL.startsWith("/") && !callbackURL.startsWith("//")
          ? callbackURL
          : "/";

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: safeCallbackURL,
      });

      if (error) {
        toast.error(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে!");
      router.replace(safeCallbackURL);
      router.refresh();
    } catch {
      toast.error("লগইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page flex min-h-[65vh] items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8"
      >
        <div className="text-center">
          <div className="text-5xl">🛒</div>
          <h1 className="mt-4 text-3xl font-black text-gray-900">
            আবার ফিরে আসুন
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টে লগইন করুন
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-gray-800"
            >
              ইমেইল
            </label>
            <input
              id="email"
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-gray-800"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "লগইন হচ্ছে..." : "Sign In"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-bold text-green-700 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </section>
  );
}

export default function SigninPage() {
  return (
    <Suspense
      fallback={
        <section className="container-page flex min-h-[65vh] items-center justify-center">
          <p>লোড হচ্ছে...</p>
        </section>
      }
    >
      <SigninForm />
    </Suspense>
  );
}
