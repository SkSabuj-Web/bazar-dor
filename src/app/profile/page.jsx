
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  LogOut,
  Save,
  LoaderCircle,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize the profile name after the session loads.
  useEffect(() => {
    if (session?.user && !initialized) {
      setName(session.user.name || "");
      setInitialized(true);
    }
  }, [session, initialized]);

  // Redirect unauthenticated users after rendering.
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  async function handleUpdate(event) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("নাম লিখুন");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });

      if (result.error) {
        toast.error(result.error.message || "নাম আপডেট করা যায়নি");
        return;
      }

      toast.success("প্রোফাইল আপডেট হয়েছে");
      setInitialized(false);
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("লগআউট করা যায়নি");
        return;
      }

      toast.success("লগআউট সফল হয়েছে");
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("লগআউট করা যায়নি, আবার চেষ্টা করুন");
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="animate-spin text-green-600" size={32} />
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-12">
      <section className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
            <UserRound size={32} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              আমার প্রোফাইল
            </h1>
            <p className="text-sm text-gray-500">
              Bazar Dor অ্যাকাউন্ট
            </p>
          </div>
        </div>

        <div className="mb-5 rounded-xl bg-gray-50 p-4">
          <p className="mb-1 text-sm text-gray-500">ইমেইল</p>

          <div className="flex items-center gap-3 break-all font-medium text-gray-900">
            <Mail size={18} className="shrink-0 text-green-700" />
            {session.user.email}
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <label
            htmlFor="profile-name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            নাম আপডেট করুন
          </label>

          <input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            placeholder="তোমার নাম"
            required
          />

          <button
            type="submit"
            disabled={saving}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}

            {saving ? "আপডেট হচ্ছে..." : "নাম সংরক্ষণ করো"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-4 block text-center text-sm font-medium text-green-700 hover:underline"
        >
          হোমপেজে ফিরে যাও
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
        >
          <LogOut size={18} />
          লগআউট
        </button>
      </section>
    </main>
  );
}
