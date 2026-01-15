import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free QR Code Generator | Create Dynamic QR Codes with Logo & Analytics - LinkForge",
  description: "Create free dynamic QR codes with custom logos, colors & real-time scan tracking. Best QR code generator for restaurants, packaging, business cards & marketing. Download PNG, SVG, PDF. No signup required!",
  keywords: [
    "QR code generator",
    "free QR code maker",
    "dynamic QR code",
    "QR code with logo",
    "custom QR code",
    "QR code generator free",
    "restaurant menu QR code",
    "QR code for business card",
    "QR code analytics",
    "trackable QR code",
    "QR code creator",
    "bulk QR code generator",
    "QR code scanner",
    "QR code design",
    "branded QR code",
    "WiFi QR code",
    "vCard QR code",
  ],
  openGraph: {
    title: "Free QR Code Generator | Create Custom QR Codes with Logo - LinkForge",
    description: "Generate beautiful, trackable QR codes in seconds. Add your logo, customize colors, track scans. Perfect for menus, packaging, marketing & business cards.",
    type: "website",
    images: [
      {
        url: "/og-qr-codes.png",
        width: 1200,
        height: 630,
        alt: "LinkForge QR Code Generator - Create Custom QR Codes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator with Logo & Analytics | LinkForge",
    description: "Create beautiful, trackable QR codes in seconds. Customize colors, add logos, track scans in real-time.",
  },
  alternates: {
    canonical: "https://linkforge.io/products/qr-codes",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
