import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions - For Every Business",
  description: "LinkForge solutions for marketers, creators, agencies, and enterprises. Discover how our platform can help you grow.",
  keywords: ["link management solutions", "business URL shortener", "enterprise link shortener"],
  openGraph: {
    title: "LinkForge Solutions",
    description: "Powerful link management solutions for businesses of all sizes.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
