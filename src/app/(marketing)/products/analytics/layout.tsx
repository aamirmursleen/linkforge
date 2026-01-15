import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Analytics & Click Tracking | Real-Time URL Analytics Dashboard - LinkForge",
  description: "Track every click with powerful link analytics. Real-time dashboards, geographic heatmaps, device data, referrer tracking & conversion analytics. Free link tracking for marketers. Best Google Analytics alternative for links.",
  keywords: [
    "link analytics",
    "URL tracking",
    "click tracking",
    "link statistics",
    "click analytics",
    "link performance",
    "URL analytics",
    "real-time link tracking",
    "geographic analytics",
    "device tracking",
    "referrer tracking",
    "conversion tracking",
    "marketing analytics",
    "campaign tracking",
    "link click counter",
    "short link analytics",
  ],
  openGraph: {
    title: "Link Analytics & Click Tracking Dashboard | LinkForge",
    description: "Real-time link analytics with geographic heatmaps, device data & conversion tracking. See exactly who clicks your links and when. Free analytics included.",
    type: "website",
    images: [
      {
        url: "/og-analytics.png",
        width: 1200,
        height: 630,
        alt: "LinkForge Analytics Dashboard - Track Every Click",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Analytics & Click Tracking | LinkForge",
    description: "Track every click with real-time dashboards, geographic data & device analytics. Free link tracking for marketers.",
  },
  alternates: {
    canonical: "https://linkforge.io/products/analytics",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
