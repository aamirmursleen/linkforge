import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LinkForge | Our Story, Mission & Team - Trusted by 500K+ Businesses",
  description: "Learn about LinkForge - the link management platform trusted by 500,000+ businesses worldwide. Founded in 2020, we've helped create 10B+ short links across 150+ countries. Meet our team and discover our mission to make every connection count.",
  keywords: [
    "about linkforge",
    "linkforge story",
    "linkforge team",
    "linkforge company",
    "URL shortener company",
    "link management platform",
    "who made linkforge",
    "linkforge founders",
    "linkforge mission",
    "linkforge history",
  ],
  openGraph: {
    title: "About LinkForge | Our Story & Mission - Trusted by 500K+ Businesses",
    description: "Discover the story behind LinkForge. From a simple URL shortener to a comprehensive link management platform serving 500K+ businesses in 150+ countries.",
    type: "website",
    images: [
      {
        url: "/og-about.png",
        width: 1200,
        height: 630,
        alt: "About LinkForge - Our Story & Mission",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About LinkForge | Our Story & Team",
    description: "The story behind LinkForge - from startup to 500K+ customers. Meet the team building the future of link management.",
  },
  alternates: {
    canonical: "https://linkforge.io/company/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
