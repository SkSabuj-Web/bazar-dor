
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSocialSignIn(provider) {
    if (loading || socialLoading) return;

    setSocialLoading(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/signin",
      });

      if (result?.error) {
        console.error(`${provider} login error:`, result.error);

        toast.error(
          result.error.message ||
            `${provider === "github" ? "GitHub" : "Google"} দিয়ে লগইন করা যায়নি`
        );

        setSocialLoading("");
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);

      toast.error("সোশ্যাল লগইন করা যায়নি। আবার চেষ্টা করুন।");
      setSocialLoading("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading || socialLoading) return;

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
    } catch (error) {
      console.error("Email login error:", error);
      toast.error("লগইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  const isBusy = loading || Boolean(socialLoading);

  return (
    <section className="container-page flex min-h-[65vh] items-center justify-center py-8 sm:py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-4 shadow-lg sm:rounded-3xl sm:p-8"
      >
        <div className="text-center">
          <div className="text-4xl sm:text-5xl" aria-hidden="true">
            🛒
          </div>

          <h1 className="mt-4 text-2xl font-black leading-tight text-gray-900 sm:text-3xl">
            আবার ফিরে আসুন
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            আপনার অ্যাকাউন্টে লগইন করুন
          </p>
        </div>

        <div className="mt-6 space-y-4 sm:mt-7">
          <div className="min-w-0">
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
              className="min-h-12 w-full min-w-0 rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="min-w-0">
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
              className="min-h-12 w-full min-w-0 rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="min-h-12 w-full rounded-xl bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "লগইন হচ্ছে..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={isBusy}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 px-4 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-lg font-bold" aria-hidden="true">
              G
            </span>

            {socialLoading === "google"
              ? "Google দিয়ে লগইন হচ্ছে..."
              : "Google দিয়ে Sign In"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={isBusy}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 px-4 py-3 font-bold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.59 1.2 3.22.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.04-1.15 3.04-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.29-2.6 5.23-5.09 5.51.4.35.75 1.03.75 2.08v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
            </svg>

            {socialLoading === "github"
              ? "GitHub দিয়ে লগইন হচ্ছে..."
              : "GitHub দিয়ে লগইন করুন"}
          </button>
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-1 text-center text-sm leading-6 text-gray-600">
          অ্যাকাউন্ট নেই?

          <Link
            href="/signup"
            className="font-bold text-green-700 underline-offset-4 hover:underline"
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
        <section className="container-page flex min-h-[65vh] items-center justify-center py-8 sm:py-12">
          <p className="text-sm text-gray-600 sm:text-base">
            লোড হচ্ছে...
          </p>
        </section>
      }
    >
      <SigninForm />
    </Suspense>
  );
}
