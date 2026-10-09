
import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-green-50 via-white to-lime-50">
      <div className="container-page grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-800">
            🌿 সঠিক দামে বাজার করুন
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            প্রতিদিনের বাজার,
            <span className="block text-green-700">দাম জানুন এক নজরে</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            চাল, ডাল, সবজি, মাছসহ নিত্যপ্রয়োজনীয় পণ্যের দাম দেখুন।
            বাজারে যাওয়ার আগে জেনে নিন আপনার প্রয়োজনীয় তথ্য।
          </p>

          <Link
            href="#সব-পণ্য"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-700/20 transition hover:-translate-y-0.5 hover:bg-green-800"
          >
            সব পণ্যের দাম দেখুন
            <span aria-hidden="true">→</span>
          </Link>

          <div className="mt-8 flex flex-wrap gap-5 text-sm text-gray-600">
            <span>✓ সহজে দাম দেখুন</span>
            <span>✓ পণ্য অনুযায়ী খুঁজুন</span>
          </div>
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center sm:min-h-[360px]">
          <div className="absolute h-64 w-64 rounded-full bg-green-200/60 blur-3xl sm:h-80 sm:w-80" />

          <div className="relative grid w-full max-w-md grid-cols-2 gap-4">
            <div className="flex min-h-40 flex-col items-center justify-center rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-green-900/5 sm:min-h-48">
              <span className="text-6xl sm:text-7xl">🥬</span>
              <span className="mt-3 font-bold text-gray-800">তাজা সবজি</span>
            </div>

            <div className="mt-8 flex min-h-40 flex-col items-center justify-center rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-green-900/5 sm:min-h-48">
              <span className="text-6xl sm:text-7xl">🍚</span>
              <span className="mt-3 font-bold text-gray-800">চাল ও ডাল</span>
            </div>

            <div className="flex min-h-40 flex-col items-center justify-center rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-green-900/5 sm:min-h-48">
              <span className="text-6xl sm:text-7xl">🐟</span>
              <span className="mt-3 font-bold text-gray-800">মাছ</span>
            </div>

            <div className="mt-8 flex min-h-40 flex-col items-center justify-center rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-green-900/5 sm:min-h-48">
              <span className="text-6xl sm:text-7xl">🥚</span>
              <span className="mt-3 font-bold text-gray-800">ডিম ও প্রোটিন</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}