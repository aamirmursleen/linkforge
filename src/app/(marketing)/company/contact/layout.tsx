import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch",
  description: "Have questions about LinkForge? Contact our team. We're here to help with sales, support, and partnerships.",
  keywords: ["contact linkforge", "support", "help", "sales inquiry"],
  openGraph: {
    title: "Contact LinkForge",
    description: "Get in touch with our team for any questions or support.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
