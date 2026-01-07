import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Analytics - Track Every Click",
  description: "Powerful link analytics with real-time tracking. See clicks, geographic data, devices, browsers, referrers, and heatmaps.",
  keywords: ["link analytics", "URL tracking", "click analytics", "link statistics"],
  openGraph: {
    title: "Link Analytics | LinkForge",
    description: "Track every click with powerful analytics and detailed reports.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
