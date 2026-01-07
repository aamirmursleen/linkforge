import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Our Story",
  description: "Learn about LinkForge, our mission to simplify link management, and the team building the future of URL shortening.",
  keywords: ["about linkforge", "link shortener company", "our team"],
  openGraph: {
    title: "About LinkForge",
    description: "Learn about our mission and the team behind LinkForge.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
