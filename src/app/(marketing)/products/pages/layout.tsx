import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Link in Bio Tool | Best Linktree Alternative for Instagram & TikTok - LinkForge",
  description: "Create beautiful bio pages for Instagram, TikTok, YouTube & Twitter. Free link in bio tool with unlimited links, custom themes, analytics & custom domains. Best Linktree alternative - no monthly fees! Used by 500K+ creators.",
  keywords: [
    "link in bio",
    "linktree alternative",
    "bio page creator",
    "Instagram bio link",
    "TikTok bio link",
    "link in bio tool",
    "free linktree alternative",
    "bio link page",
    "Instagram landing page",
    "social media bio link",
    "bio page builder",
    "link in bio free",
    "beacons alternative",
    "linktr.ee alternative",
    "bio link generator",
    "creator bio page",
  ],
  openGraph: {
    title: "Free Link in Bio Tool | Best Linktree Alternative - LinkForge",
    description: "Create stunning bio pages for Instagram, TikTok & YouTube. Unlimited links, custom themes, analytics & domains. Free forever - no Linktree fees!",
    type: "website",
    images: [
      {
        url: "/og-bio-pages.png",
        width: 1200,
        height: 630,
        alt: "LinkForge Bio Pages - Best Linktree Alternative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Link in Bio Tool | Best Linktree Alternative - LinkForge",
    description: "Create beautiful bio pages for Instagram & TikTok. Unlimited links, custom themes & analytics. Free forever!",
  },
  alternates: {
    canonical: "https://linkforge.io/products/pages",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
