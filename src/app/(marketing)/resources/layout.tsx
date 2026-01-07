import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources - Guides & Tutorials",
  description: "Learn how to get the most out of LinkForge with guides, tutorials, and best practices for link management.",
  keywords: ["link shortener guide", "URL shortener tutorial", "link management tips"],
  openGraph: {
    title: "LinkForge Resources",
    description: "Guides, tutorials, and best practices for link management.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
