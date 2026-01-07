import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Management - Shorten & Organize URLs",
  description: "Create short links with custom aliases, password protection, expiry dates, and UTM parameters. Organize with folders and tags.",
  keywords: ["URL shortener", "link management", "short link generator", "branded links"],
  openGraph: {
    title: "Link Management | LinkForge",
    description: "Create, customize, and manage all your links in one place.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
