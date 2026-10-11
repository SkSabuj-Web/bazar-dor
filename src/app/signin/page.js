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

    async function handleSocialSignIn(provider) {
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch {
            toast.error("সোশ্যাল লগইন করা যায়নি। আবার চেষ্টা করুন।");
        }
    }


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

    async function handleGoogleSignIn() {
        try {
            const result = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (result?.error) {
                toast.error("Google login করা যায়নি");
            }
        } catch {
            toast.error("Google login করা যায়নি");
        }
    }

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
                        disabled={loading}
                        className="min-h-12 w-full rounded-xl bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "লগইন হচ্ছে..." : "Sign In"}
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 px-4 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="text-lg font-bold" aria-hidden="true">
                            G
                        </span>
                        Google দিয়ে Sign In
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialSignIn("github")}
                        className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-800 transition hover:bg-gray-100"
                    >
                        GitHub দিয়ে লগইন করুন
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
                    <p className="text-sm text-gray-600 sm:text-base">লোড হচ্ছে...</p>
                </section>
            }
        >
            <SigninForm />
        </Suspense>
    );
}