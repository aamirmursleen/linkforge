"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "5 short links/month",
      "2 QR codes/month",
      "Basic analytics",
      "1 user",
      "Community support",
    ],
    cta: "Get started",
    href: "/signup",
    popular: false,
  },
  {
    name: "Starter",
    description: "For individuals and small teams",
    monthlyPrice: 9,
    yearlyPrice: 7,
    features: [
      "500 short links/month",
      "100 QR codes/month",
      "Full analytics",
      "1 custom domain",
      "3 team members",
      "Email support",
    ],
    cta: "Start free trial",
    href: "/signup?plan=starter",
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing businesses",
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      "Unlimited short links",
      "Unlimited QR codes",
      "Advanced analytics",
      "5 custom domains",
      "10 team members",
      "Priority support",
      "API access",
      "Custom link expiration",
    ],
    cta: "Start free trial",
    href: "/signup?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      "Everything in Pro",
      "Unlimited domains",
      "Unlimited team members",
      "SSO & SAML",
      "Dedicated account manager",
      "Custom contracts",
      "99.99% SLA",
      "Advanced security",
    ],
    cta: "Contact sales",
    href: "/company/contact",
    popular: false,
  },
];

const comparisonFeatures = [
  {
    category: "Links & QR Codes",
    features: [
      { name: "Short links", free: "5/mo", starter: "500/mo", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "QR codes", free: "2/mo", starter: "100/mo", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Custom domains", free: false, starter: "1", pro: "5", enterprise: "Unlimited" },
      { name: "Link scheduling", free: false, starter: true, pro: true, enterprise: true },
      { name: "Link expiration", free: false, starter: false, pro: true, enterprise: true },
      { name: "Password protection", free: false, starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: "Analytics",
    features: [
      { name: "Click tracking", free: "Basic", starter: "Full", pro: "Advanced", enterprise: "Advanced" },
      { name: "Geographic data", free: false, starter: true, pro: true, enterprise: true },
      { name: "Device analytics", free: false, starter: true, pro: true, enterprise: true },
      { name: "Custom reports", free: false, starter: false, pro: true, enterprise: true },
      { name: "Real-time dashboard", free: false, starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: "Team & Security",
    features: [
      { name: "Team members", free: "1", starter: "3", pro: "10", enterprise: "Unlimited" },
      { name: "API access", free: false, starter: false, pro: true, enterprise: true },
      { name: "SSO / SAML", free: false, starter: false, pro: false, enterprise: true },
      { name: "Audit logs", free: false, starter: false, pro: true, enterprise: true },
      { name: "SLA", free: false, starter: false, pro: "99.9%", enterprise: "99.99%" },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Community support", free: true, starter: true, pro: true, enterprise: true },
      { name: "Email support", free: false, starter: true, pro: true, enterprise: true },
      { name: "Priority support", free: false, starter: false, pro: true, enterprise: true },
      { name: "Dedicated account manager", free: false, starter: false, pro: false, enterprise: true },
    ],
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free and scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-sm", !isYearly && "font-semibold text-[var(--foreground)]")}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={cn("text-sm", isYearly && "font-semibold text-[var(--foreground)]")}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Save 20%
              </Badge>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative bg-white rounded-2xl border p-6 text-left",
                  plan.popular
                    ? "border-[var(--primary)] shadow-xl scale-105"
                    : "border-[var(--border)]"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[var(--dark)] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{plan.description}</p>
                </div>
                <div className="mb-6">
                  {plan.monthlyPrice !== null ? (
                    <>
                      <span className="text-4xl font-bold text-[var(--dark)]">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-[var(--muted)]">/month</span>
                      {isYearly && plan.monthlyPrice > 0 && (
                        <div className="text-xs text-[var(--muted)] mt-1">
                          Billed annually (${plan.yearlyPrice * 12}/year)
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-[var(--dark)]">Custom</span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "secondary"}
                  asChild
                >
                  <Link href={plan.href}>
                    {plan.cta}
                    {plan.monthlyPrice === null && <ArrowRight className="h-4 w-4" />}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Compare all features
            </h2>
            <p className="text-lg text-[var(--muted)]">
              See exactly what you get with each plan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-4 px-4 font-medium text-[var(--muted)]">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-[var(--dark)]">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-[var(--dark)]">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold text-[var(--primary)]">Pro</th>
                  <th className="text-center py-4 px-4 font-semibold text-[var(--dark)]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((section) => (
                  <>
                    <tr key={section.category} className="bg-[var(--primary-pale)]/30">
                      <td colSpan={5} className="py-3 px-4 font-semibold text-[var(--dark)]">
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-[var(--border)]">
                        <td className="py-4 px-4 text-sm">{feature.name}</td>
                        {["free", "starter", "pro", "enterprise"].map((plan) => (
                          <td key={plan} className="py-4 px-4 text-center">
                            {typeof feature[plan as keyof typeof feature] === "boolean" ? (
                              feature[plan as keyof typeof feature] ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm">{feature[plan as keyof typeof feature]}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Can I change plans at any time?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all paid plans come with a 14-day free trial. No credit card required.",
              },
              {
                q: "What happens if I exceed my limits?",
                a: "We'll notify you when you're approaching your limits. You can upgrade anytime to get more capacity.",
              },
              {
                q: "Do you offer discounts for non-profits?",
                a: "Yes, we offer special pricing for non-profit organizations. Contact our sales team for details.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-[var(--primary)] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[var(--dark)] mb-2">{faq.q}</h3>
                    <p className="text-[var(--muted)]">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Start your free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
              <Link href="/signup">
                Start free trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/company/contact">Talk to sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
