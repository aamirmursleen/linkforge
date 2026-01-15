import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkForge Features | URL Shortener, QR Codes, Bio Pages & Analytics Guide",
  description: "Complete guide to LinkForge features: URL shortener with custom aliases, dynamic QR code generator, link-in-bio pages, real-time analytics dashboard, UTM builder & custom domains. Step-by-step tutorials included. Free to use!",
  keywords: [
    "linkforge features",
    "URL shortener features",
    "QR code generator features",
    "bio page builder features",
    "link analytics features",
    "UTM builder tutorial",
    "how to shorten URL",
    "how to create QR code",
    "how to make bio page",
    "link shortener tutorial",
    "QR code tutorial",
    "custom domain links",
    "password protected links",
    "link expiration",
    "link management features",
  ],
  openGraph: {
    title: "LinkForge Features & Tutorials | Complete Guide to Link Management",
    description: "Everything you need: URL shortener, QR codes, bio pages, analytics & UTM builder. Free step-by-step tutorials included.",
    type: "website",
    images: [
      {
        url: "/og-features.png",
        width: 1200,
        height: 630,
        alt: "LinkForge Features - URL Shortener, QR Codes, Bio Pages & Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkForge Features | URL Shortener, QR Codes, Bio Pages & Analytics",
    description: "Complete link management toolkit with free tutorials. URL shortener, QR codes, bio pages & real-time analytics.",
  },
  alternates: {
    canonical: "https://linkforge.io/features",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
