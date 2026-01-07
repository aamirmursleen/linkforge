import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "LinkForge - Modern Link Management Platform",
    template: "%s | LinkForge",
  },
  description: "Create short links, QR codes, and bio pages. Track clicks with powerful analytics. Lifetime deal - pay once, use forever!",
  keywords: [
    "link shortener",
    "URL shortener",
    "QR code generator",
    "link management",
    "bio pages",
    "link in bio",
    "analytics",
    "short links",
    "custom domains",
    "branded links",
    "lifetime deal",
  ],
  authors: [{ name: "LinkForge" }],
  creator: "LinkForge",
  publisher: "LinkForge",
  metadataBase: new URL("https://linkforge.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LinkForge",
    title: "LinkForge - Modern Link Management Platform",
    description: "Create short links, QR codes, and bio pages. Track clicks with powerful analytics. Lifetime deal available!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkForge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkForge - Modern Link Management Platform",
    description: "Create short links, QR codes, and bio pages. Track clicks with powerful analytics.",
    images: ["/og-image.png"],
    creator: "@linkforge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
    </div>
  );
}
