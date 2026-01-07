import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bio Pages - Link in Bio Tool",
  description: "Create beautiful bio pages for Instagram, TikTok, and more. Add links, social icons, images, and customize themes.",
  keywords: ["link in bio", "bio page creator", "Instagram bio link", "linktree alternative"],
  openGraph: {
    title: "Bio Pages | LinkForge",
    description: "Create a stunning bio page with all your links in one place.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
