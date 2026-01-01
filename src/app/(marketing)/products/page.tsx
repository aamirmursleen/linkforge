import Link from "next/link";
import {
  Link2,
  QrCode,
  BarChart3,
  Plug,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    icon: Link2,
    title: "Link Management",
    description: "Create branded short links with custom domains, advanced targeting, and real-time analytics.",
    features: ["Custom branded domains", "Link expiration & scheduling", "Password protection", "A/B testing"],
    href: "/products/link-management",
    color: "from-blue-500 to-purple-600",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description: "Generate dynamic QR codes that can be updated anytime without reprinting.",
    features: ["Dynamic QR codes", "Custom designs & colors", "Scan analytics", "Bulk generation"],
    href: "/products/qr-codes",
    color: "from-green-500 to-teal-600",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Get deep insights into your link performance with real-time dashboards.",
    features: ["Real-time tracking", "Geographic data", "Device breakdown", "Custom reports"],
    href: "/products/analytics",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Plug,
    title: "Integrations",
    description: "Connect LinkForge with your favorite tools and automate your workflows.",
    features: ["100+ integrations", "Zapier & webhooks", "API access", "Custom workflows"],
    href: "/products/integrations",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: FileText,
    title: "Pages",
    description: "Build mobile-friendly landing pages without any coding required.",
    features: ["Drag-and-drop builder", "Mobile-optimized", "Custom domains", "Form collection"],
    href: "/products/pages",
    color: "from-indigo-500 to-blue-600",
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Products</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
            All the tools you need to
            <br />
            <span className="gradient-text">manage your links</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            From link shortening to advanced analytics, LinkForge provides everything
            you need to create, manage, and track your links at scale.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section">
        <div className="container">
          <div className="grid gap-8">
            {products.map((product, index) => (
              <div
                key={product.title}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                      <product.icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--dark)]">
                      {product.title}
                    </h2>
                  </div>
                  <p className="text-lg text-[var(--muted)] mb-6">
                    {product.description}
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="h-5 w-5 rounded-full bg-[var(--primary-pale)] flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-[var(--primary)]" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild>
                    <Link href={product.href}>
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className={`rounded-2xl bg-gradient-to-br ${product.color} p-1`}>
                    <div className="bg-white rounded-xl p-8 h-64 flex items-center justify-center">
                      <product.icon className="h-24 w-24 text-[var(--border)]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-[var(--muted)] mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using LinkForge to manage their links.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start for free</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
