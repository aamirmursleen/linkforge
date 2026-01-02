import Link from "next/link";
import {
  QrCode,
  Palette,
  RefreshCw,
  BarChart3,
  Download,
  Layers,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRGenerator } from "@/components/qr-generator";

const features = [
  {
    icon: RefreshCw,
    title: "Dynamic QR Codes",
    description: "Update the destination URL anytime without reprinting the QR code.",
  },
  {
    icon: Palette,
    title: "Custom Designs",
    description: "Add your logo, change colors, and customize the style to match your brand.",
  },
  {
    icon: BarChart3,
    title: "Scan Analytics",
    description: "Track scans in real-time with location, device, and time data.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Download in PNG, SVG, or PDF format for any use case.",
  },
  {
    icon: Layers,
    title: "Bulk Generation",
    description: "Generate hundreds of QR codes at once with our bulk tools.",
  },
  {
    icon: QrCode,
    title: "Templates",
    description: "Choose from pre-designed templates for menus, business cards, and more.",
  },
];

const useCases = [
  { title: "Product Packaging", description: "Link customers to product info, manuals, or warranty registration." },
  { title: "Restaurant Menus", description: "Create contactless digital menus that are easy to update." },
  { title: "Business Cards", description: "Share your contact info and social profiles instantly." },
  { title: "Marketing Materials", description: "Add QR codes to flyers, posters, and print ads." },
  { title: "Event Tickets", description: "Enable fast check-in with scannable QR codes." },
  { title: "Retail Displays", description: "Connect in-store products to online content and reviews." },
];

export default function QRCodesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">QR Codes</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
                Dynamic QR codes
                <br />
                <span className="gradient-text">that work harder</span>
              </h1>
              <p className="text-lg text-[var(--muted)] mb-8">
                Create beautiful, trackable QR codes that you can update anytime.
                Perfect for packaging, menus, marketing, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Create QR code
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center">
              <QRGenerator />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              QR codes with superpowers
            </h2>
            <p className="text-lg text-[var(--muted)]">
              More than just a QR code generator. Build, brand, and track.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary-pale)] mb-4">
                  <feature.icon className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Built for every industry
            </h2>
            <p className="text-lg text-[var(--muted)]">
              See how businesses use LinkForge QR codes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="bg-white rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                  {useCase.title}
                </h3>
                <p className="text-[var(--muted)]">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start creating QR codes today
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Generate your first QR code in seconds. No design skills required.
          </p>
          <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
            <Link href="/signup">
              Create free QR code
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
