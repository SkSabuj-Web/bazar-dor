
export default function Footer() {
  return (
    <footer className="border-t border-green-100 bg-white">
      <div className="container-page flex flex-col gap-4 py-7 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-green-800">
          🛒 বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
        <p className="max-w-xl leading-6 md:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}