import Link from "next/link";
import { Check, Zap, Clock, Shield, ArrowRight, X, Link2, QrCode, Globe, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkForge Pricing | Lifetime Deal 90% OFF - $27 One-Time Payment | Best Bitly Alternative",
  description: "Get lifetime access to LinkForge for just $27 (was $297). Unlimited short links, QR codes, bio pages, 365-day analytics, 10 custom domains, 10 team members. Best Bitly alternative - save $1,713+ over 5 years. No monthly fees, pay once use forever!",
  keywords: [
    "linkforge pricing",
    "lifetime deal",
    "link shortener pricing",
    "one time payment URL shortener",
    "bitly alternative pricing",
    "cheap link shortener",
    "URL shortener lifetime deal",
    "best URL shortener deal",
    "link management pricing",
    "QR code generator pricing",
    "affordable link shortener",
    "linkforge lifetime",
    "bitly vs linkforge",
  ],
  openGraph: {
    title: "LinkForge Pricing - Lifetime Deal 90% OFF | $27 One-Time Payment",
    description: "Pay once, use forever. Get unlimited links, QR codes, analytics & 10 custom domains for just $27. Save $1,713+ vs Bitly over 5 years.",
    type: "website",
    images: [
      {
        url: "/og-pricing.png",
        width: 1200,
        height: 630,
        alt: "LinkForge Pricing - Lifetime Deal 90% OFF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkForge Lifetime Deal - $27 One-Time Payment | 90% OFF",
    description: "Unlimited links, QR codes, analytics & custom domains. Pay once, use forever. Best Bitly alternative.",
  },
  alternates: {
    canonical: "https://linkforge.io/pricing",
  },
};

const freeFeatures = [
  { feature: "Short links", value: "10/month", included: true },
  { feature: "Custom aliases", value: "No", included: false },
  { feature: "QR codes", value: "5/month", included: true },
  { feature: "Bio pages", value: "1 page", included: true },
  { feature: "Custom domains", value: "No", included: false },
  { feature: "Analytics", value: "30 days", included: true },
  { feature: "Password protected links", value: "No", included: false },
  { feature: "Link expiry dates", value: "No", included: false },
  { feature: "Team members", value: "No", included: false },
  { feature: "API access", value: "No", included: false },
];

const proFeatures = [
  { feature: "Short links", value: "Unlimited", included: true },
  { feature: "Custom aliases", value: "Yes", included: true },
  { feature: "QR codes", value: "Unlimited", included: true },
  { feature: "Bio pages", value: "Unlimited", included: true },
  { feature: "Custom domains", value: "10 domains", included: true },
  { feature: "Analytics", value: "365 days", included: true },
  { feature: "Password protected links", value: "Yes", included: true },
  { feature: "Link expiry dates", value: "Yes", included: true },
  { feature: "Team members", value: "10 members", included: true },
  { feature: "API access", value: "Yes", included: true },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4 bg-red-100 text-red-600 border-red-200">
            Lifetime Deal - 90% OFF
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
            One plan. Everything included.
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-12">
            No complicated tiers. Get access to all features at one simple price.
          </p>

          {/* Pricing Cards - Free vs Pro */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[var(--dark)] mb-2">Free</h3>
                <p className="text-[var(--muted)]">Perfect to get started</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--dark)]">$0</span>
                <span className="text-[var(--muted)]">/forever</span>
              </div>

              <Button variant="outline" size="lg" className="w-full mb-6" asChild>
                <Link href="/sign-up">Start Free</Link>
              </Button>

              <div className="space-y-3">
                {freeFeatures.map((item) => (
                  <div key={item.feature} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.included ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300" />
                      )}
                      <span className={item.included ? "text-[var(--dark)]" : "text-gray-400"}>{item.feature}</span>
                    </div>
                    <span className={`text-sm font-medium ${item.included ? "text-[var(--primary)]" : "text-gray-400"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-white rounded-3xl border-2 border-[var(--primary)] shadow-2xl p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-red-500 text-white px-4 py-1 text-sm">
                  <Zap className="w-4 h-4 mr-1" /> LIFETIME DEAL - 90% OFF
                </Badge>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[var(--dark)] mb-2">Pro</h3>
                <p className="text-[var(--muted)]">Everything unlimited</p>
              </div>

              <div className="mb-6">
                <span className="text-xl text-[var(--muted)] line-through mr-2">$297</span>
                <span className="text-4xl font-bold text-[var(--dark)]">$27</span>
                <span className="text-[var(--muted)]"> one-time</span>
              </div>

              <Button size="lg" className="w-full mb-6" asChild>
                <Link href="/sign-up">
                  Get Lifetime Access
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <div className="space-y-3">
                {proFeatures.map((item) => (
                  <div key={item.feature} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-[var(--dark)]">{item.feature}</span>
                    </div>
                    <span className="text-sm font-medium text-[var(--primary)]">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>30-day guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Features Work */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Simple steps to create your branded short links
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Normal Short Link */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-pale)] flex items-center justify-center mb-4">
                <Link2 className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">1. Basic Short Link</h3>
              <p className="text-sm text-[var(--muted)] mb-4">Paste any long URL and get a short link instantly</p>
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <div className="text-gray-500 mb-1">Long URL:</div>
                <div className="text-xs text-gray-600 truncate mb-2">youtube.com/watch?v=abc...</div>
                <div className="text-gray-500 mb-1">Short URL:</div>
                <div className="text-[var(--primary)] font-medium">linkforge.io/r/xYz123</div>
              </div>
            </div>

            {/* Custom Alias */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold text-lg">/a</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">2. Custom Alias</h3>
              <p className="text-sm text-[var(--muted)] mb-4">Choose your own memorable slug</p>
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <div className="text-gray-500 mb-1">Instead of random code:</div>
                <div className="text-gray-400 line-through mb-2">linkforge.io/r/xYz123</div>
                <div className="text-gray-500 mb-1">Use your own:</div>
                <div className="text-green-600 font-medium">linkforge.io/r/my-promo</div>
              </div>
            </div>

            {/* Custom Domain */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">3. Custom Domain</h3>
              <p className="text-sm text-[var(--muted)] mb-4">Use your own branded domain</p>
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <div className="text-gray-500 mb-1">Instead of LinkForge domain:</div>
                <div className="text-gray-400 line-through mb-2">linkforge.io/r/promo</div>
                <div className="text-gray-500 mb-1">Use your brand:</div>
                <div className="text-purple-600 font-medium">links.yoursite.com/promo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Everything included in Pro
            </h2>
            <p className="text-lg text-[var(--muted)]">
              No hidden fees. No feature limits. No surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              title="Links & QR Codes"
              features={[
                "Unlimited short links",
                "Unlimited QR codes",
                "Custom aliases",
                "Password protection",
                "Link expiration",
                "Link scheduling",
              ]}
            />
            <FeatureCard
              title="Analytics & Insights"
              features={[
                "365 days data retention",
                "Click tracking",
                "Geographic data",
                "Device analytics",
                "Referrer tracking",
                "Export to CSV",
              ]}
            />
            <FeatureCard
              title="Branding & Team"
              features={[
                "10 custom domains",
                "Custom link aliases",
                "10 team members",
                "Unlimited bio pages",
                "API access",
                "Priority support",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Questions? We've got answers.
            </h2>
          </div>

          <div className="space-y-4">
            <FAQ
              q="Is this really a lifetime deal for $27?"
              a="Yes! Pay once and get lifetime access to all features. No recurring fees, no hidden charges."
            />
            <FAQ
              q="What is a Custom Domain?"
              a="Instead of linkforge.io/r/abc123, you can use your own domain like links.yoursite.com/promo. Free users get 2 custom domains, Pro gets 10."
            />
            <FAQ
              q="What is a Custom Alias?"
              a="Instead of random codes like /r/xYz123, you can create memorable links like /r/my-promo or /r/summer-sale. Available for both Free and Pro users."
            />
            <FAQ
              q="How do Custom Domains work?"
              a="1) Add your domain in settings, 2) Add a CNAME record pointing to us, 3) Verify it, 4) Start creating branded short links!"
            />
            <FAQ
              q="What's included in Free plan?"
              a="10 links/month, 5 QR codes, 1 bio page, 30-day analytics, and full click tracking. No credit card required!"
            />
            <FAQ
              q="Is there a money-back guarantee?"
              a="Yes! We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund you - no questions asked."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <Badge className="mb-4 bg-red-500 text-white">LIFETIME DEAL - 90% OFF</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't miss this lifetime deal!
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Pay once, use forever. Join thousands who already locked in their lifetime access.
          </p>
          <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
            <Link href="/sign-up">
              Get Lifetime Access - $27
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
          <p className="text-sm text-gray-400 mt-4">One-time payment • 30-day money-back guarantee</p>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ title, features }: { title: string; features: string[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
      <h3 className="text-lg font-semibold text-[var(--dark)] mb-4">{title}</h3>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-500 shrink-0" />
            <span className="text-[var(--muted)]">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="font-semibold text-[var(--dark)] mb-2">{q}</h3>
      <p className="text-[var(--muted)]">{a}</p>
    </div>
  );
}
