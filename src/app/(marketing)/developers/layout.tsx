import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers - API Documentation",
  description: "Integrate LinkForge into your apps with our powerful REST API. Create links, generate QR codes, and access analytics programmatically.",
  keywords: ["link shortener API", "URL shortener API", "developer API", "REST API"],
  openGraph: {
    title: "LinkForge API for Developers",
    description: "Build powerful integrations with our comprehensive API.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
