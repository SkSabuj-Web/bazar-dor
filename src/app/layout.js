
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PriceTicker from "@/components/PriceTicker";

export const metadata = {
  title: {
    default: "বাজার দর | Bazar Dor",
    template: "%s | বাজার দর",
  },
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে দেখুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="min-h-screen">
        <Navbar />
        <PriceTicker />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}