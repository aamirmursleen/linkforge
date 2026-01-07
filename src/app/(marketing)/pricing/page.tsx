import Link from "next/link";
import { Check, Zap, Clock, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Lifetime Deal 90% OFF",
  description: "Get lifetime access to LinkForge for just $27. One-time payment, no monthly fees. Unlimited links, QR codes, bio pages, analytics, and all premium features.",
  keywords: ["lifetime deal", "link shortener pricing", "one time payment", "best URL shortener deal"],
  openGraph: {
    title: "LinkForge Pricing - Lifetime Deal 90% OFF",
    description: "Pay once, use forever. Get all premium features for just $27.",
  },
};

const features = [
  "Unlimited short links",
  "Unlimited QR codes",
  "Unlimited bio pages",
  "Advanced analytics (365 days)",
  "10 custom domains",
  "10 team members",
  "Password protected links",
  "Link expiry dates",
  "Custom link aliases",
  "Export analytics (CSV)",
  "API access",
  "Priority support",
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

          {/* Single Pricing Card */}
          <div className="max-w-lg mx-auto">
            <div className="relative bg-white rounded-3xl border-2 border-[var(--primary)] shadow-2xl p-8 md:p-10">
              {/* Sale Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-red-500 text-white px-4 py-1 text-sm">
                  <Zap className="w-4 h-4 mr-1" /> LIFETIME DEAL
                </Badge>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[var(--dark)] mb-2">LinkForge Pro</h3>
                <p className="text-[var(--muted)]">Everything you need to manage your links</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl text-[var(--muted)] line-through">$297</span>
                  <span className="text-5xl md:text-6xl font-bold text-[var(--dark)]">$27</span>
                </div>
                <p className="text-lg text-green-600 font-semibold">One-time payment • Lifetime access</p>
                <p className="text-sm text-[var(--muted)] mt-1">No monthly fees. Pay once, use forever.</p>
              </div>

              {/* CTA Button */}
              <Button size="lg" className="w-full text-lg py-6 mb-8" asChild>
                <Link href="/sign-up">
                  Get Lifetime Access - $27
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-[var(--dark)]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Cancel Anytime</span>
                </div>
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
              Everything included in your plan
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
              title="Team & Advanced"
              features={[
                "10 team members",
                "10 custom domains",
                "Unlimited bio pages",
                "API access",
                "Priority support",
                "No branding",
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
              q="What does lifetime access mean?"
              a="You pay once and use LinkForge forever. All current features plus all future updates included."
            />
            <FAQ
              q="How long will this deal last?"
              a="This is a limited-time offer. Once the deal ends, we'll switch to monthly pricing. Lock in your lifetime access now!"
            />
            <FAQ
              q="Is there a money-back guarantee?"
              a="Yes! We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund you - no questions asked."
            />
            <FAQ
              q="What payment methods do you accept?"
              a="We accept all major credit cards and PayPal."
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
