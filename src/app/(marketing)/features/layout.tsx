import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - All-in-One Link Management",
  description: "Discover LinkForge features: short links, QR codes, bio pages, advanced analytics, custom domains, password protection, and team collaboration.",
  keywords: ["link shortener features", "QR code features", "URL analytics", "bio page builder"],
  openGraph: {
    title: "LinkForge Features - Everything You Need",
    description: "Short links, QR codes, bio pages, analytics, and more.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
