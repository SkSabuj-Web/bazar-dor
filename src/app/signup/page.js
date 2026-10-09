
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
     const result = await authClient.signUp.email({
  name,
  email,
  password,
  callbackURL: "/",
});

console.log("Signup result:", result);

if (result.error) {
  console.error("Signup error:", result.error);
  toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
  return;
}

     

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
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
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            বাজার দর-এর সঙ্গে যুক্ত হোন
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold">আপনার নাম</label>
            <input
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="আপনার পুরো নাম"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">ইমেইল</label>
            <input
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
            <label className="mb-2 block text-sm font-bold">পাসওয়ার্ড</label>
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "Sign Up"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="font-bold text-green-700 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </section>
  );
}