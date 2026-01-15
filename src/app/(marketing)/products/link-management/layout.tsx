import { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Shortener & Link Management Tool | Create Branded Short Links - LinkForge",
  description: "Create branded short links with custom domains, password protection, link expiration & UTM tracking. Best Bitly alternative with 34% higher CTR. Free URL shortener with analytics. Try LinkForge today!",
  keywords: [
    "URL shortener",
    "link shortener",
    "short link generator",
    "branded links",
    "custom short URLs",
    "link management tool",
    "Bitly alternative",
    "free URL shortener",
    "link tracking",
    "branded URL shortener",
    "custom domain links",
    "shorten URL",
    "tiny URL",
    "link analytics",
    "UTM builder",
    "password protected links",
  ],
  openGraph: {
    title: "URL Shortener & Link Management Tool | LinkForge",
    description: "Create branded short links with custom domains, analytics & advanced targeting. Best Bitly alternative - 34% higher click-through rates. Try free!",
    type: "website",
    images: [
      {
        url: "/og-link-management.png",
        width: 1200,
        height: 630,
        alt: "LinkForge URL Shortener - Create Branded Short Links",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best URL Shortener & Link Management Tool | LinkForge",
    description: "Create branded short links with custom domains & analytics. 34% higher CTR than generic links. Try free!",
  },
  alternates: {
    canonical: "https://linkforge.io/products/link-management",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
