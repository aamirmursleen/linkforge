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

      {/* Stats Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50M+", label: "QR Codes Generated" },
              { value: "1B+", label: "Total Scans Tracked" },
              { value: "195+", label: "Countries Supported" },
              { value: "99.9%", label: "Uptime Guaranteed" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-[var(--primary)] mb-2">{stat.value}</div>
                <div className="text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Frequently Asked Questions About QR Codes
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Everything you need to know about creating and using QR codes.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What is a QR code and how does it work?",
                answer: "A QR (Quick Response) code is a two-dimensional barcode that stores information like URLs, text, or contact details. When scanned with a smartphone camera, it instantly directs users to the encoded content. QR codes work by using a pattern of black squares on a white background that scanners can read from any angle."
              },
              {
                question: "What's the difference between static and dynamic QR codes?",
                answer: "Static QR codes have fixed content that cannot be changed after creation - the URL is encoded directly in the pattern. Dynamic QR codes (like those from LinkForge) use a short redirect URL, allowing you to change the destination anytime without reprinting. Dynamic codes also provide scan analytics, making them ideal for marketing."
              },
              {
                question: "Can I add my logo to a QR code?",
                answer: "Yes! LinkForge lets you add your company logo to the center of any QR code. Our system uses error correction to ensure the code remains scannable even with a logo. You can also customize colors, patterns, and corner styles to match your brand identity."
              },
              {
                question: "How do I create a QR code for a restaurant menu?",
                answer: "Creating a menu QR code is simple: 1) Upload your menu PDF or link to your digital menu page, 2) Generate a dynamic QR code, 3) Customize with your restaurant's colors and logo, 4) Download and print on table tents or stickers. With dynamic codes, you can update your menu anytime without reprinting."
              },
              {
                question: "What file formats can I download QR codes in?",
                answer: "LinkForge supports multiple formats: PNG (best for web and screens), SVG (scalable vector for any size print), and PDF (ideal for professional printing). For large format printing like banners or billboards, we recommend SVG as it scales infinitely without losing quality."
              },
              {
                question: "How small can I print a QR code?",
                answer: "The minimum recommended size is 2cm x 2cm (0.8 x 0.8 inches) for reliable scanning. For codes with logos, increase to at least 3cm x 3cm. Larger codes scan faster and from greater distances. For billboards or signs meant to be scanned from far away, calculate size based on scanning distance."
              },
              {
                question: "Can I track how many times my QR code is scanned?",
                answer: "Yes! LinkForge provides comprehensive scan analytics including: total scans, unique vs repeat scans, geographic location (country, city), device type and operating system, scan time and date, and referral source. All data is available in real-time through your dashboard."
              },
              {
                question: "Do QR codes expire?",
                answer: "Static QR codes never expire as long as the destination URL exists. With LinkForge dynamic QR codes, you can optionally set expiration dates for time-sensitive campaigns like event tickets or limited promotions. After expiration, you can show a custom message or redirect to an alternative page."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-3">{faq.question}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Create Your Free QR Code in Seconds
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join millions of businesses using LinkForge QR codes for menus, packaging, marketing, and more. No design skills or signup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
              <Link href="/signup">
                Generate Free QR Code
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/pricing">See Pricing Plans</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">Free forever · No credit card · Unlimited static QR codes</p>
        </div>
      </section>
    </>
  );
}
