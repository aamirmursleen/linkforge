import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Custom QR Codes",
  description: "Generate beautiful QR codes for URLs, WiFi, contacts, SMS, and email. Customize colors, add logos, download in PNG or SVG.",
  keywords: ["QR code generator", "QR code maker", "custom QR codes", "free QR code generator"],
  openGraph: {
    title: "QR Code Generator | LinkForge",
    description: "Create stunning QR codes in seconds. Customize colors and add logos.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
