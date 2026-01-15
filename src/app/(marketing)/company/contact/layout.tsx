import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact LinkForge | Support, Sales & Partnership Inquiries",
  description: "Get in touch with LinkForge team. 24/7 customer support, sales inquiries, partnership opportunities & technical help. Average response time under 2 hours. Email us or use our contact form.",
  keywords: [
    "contact linkforge",
    "linkforge support",
    "linkforge help",
    "linkforge email",
    "linkforge customer service",
    "linkforge sales",
    "linkforge partnership",
    "URL shortener support",
    "link management help",
  ],
  openGraph: {
    title: "Contact LinkForge | Support, Sales & Partnerships",
    description: "Get help from our team. 24/7 support with under 2-hour response time. Sales inquiries & partnership opportunities welcome.",
    type: "website",
    images: [
      {
        url: "/og-contact.png",
        width: 1200,
        height: 630,
        alt: "Contact LinkForge - Support & Sales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact LinkForge | 24/7 Support & Sales",
    description: "Get help from our team. Average response time under 2 hours. Sales & partnership inquiries welcome.",
  },
  alternates: {
    canonical: "https://linkforge.io/company/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
