import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust & Security",
  description: "LinkForge is built with security first. Learn about our security practices, data protection, GDPR compliance, and uptime guarantee.",
  keywords: ["link shortener security", "secure URL shortener", "data protection", "GDPR"],
  openGraph: {
    title: "Trust & Security | LinkForge",
    description: "Enterprise-grade security for your links and data.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
