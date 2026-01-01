"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Link2,
  QrCode,
  BarChart3,
  Plug,
  FileText,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Check,
  Star,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  {
    ssr: false,
    loading: () => (
      <div className="h-[192px] w-[192px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    )
  }
);

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"link" | "qr">("link");
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!url) return;

    // Add https:// if missing
    let processedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processedUrl = "https://" + url;
    }

    // Generate short URL
    const randomId = Math.random().toString(36).substring(2, 8);
    setShortUrl(`linkforge.io/${randomId}`);
    setUrl(processedUrl);
    setIsGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 300, 300);

        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleReset = () => {
    setUrl("");
    setShortUrl("");
    setIsGenerated(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-6 pb-12 lg:pt-10 lg:pb-16 bg-gradient-to-b from-primary-pale/50 to-white overflow-hidden">
        <div className="container">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Trusted by 500,000+ businesses
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark leading-[1.1] tracking-tight mb-6">
              Shorten links.
              <span className="text-primary"> Amplify results.</span>
            </h1>

            <p className="text-lg text-muted mb-6 leading-relaxed">
              Create branded short links, generate QR codes, and track performance with powerful analytics.
            </p>
          </div>

          {/* URL Shortener / QR Code Generator */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => { setActiveTab("link"); handleReset(); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${
                    activeTab === "link"
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted hover:text-dark hover:bg-gray-50"
                  }`}
                >
                  <Link2 className="h-5 w-5" />
                  Shorten URL
                </button>
                <button
                  onClick={() => { setActiveTab("qr"); handleReset(); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${
                    activeTab === "qr"
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted hover:text-dark hover:bg-gray-50"
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                  Generate QR
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {!isGenerated ? (
                  <>
                    {/* Input */}
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={activeTab === "link" ? "Paste your long URL here..." : "Enter URL for QR code..."}
                        className="flex-1 h-14 px-5 rounded-xl border border-gray-200 text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                      />
                      <Button size="lg" className="h-14 px-8" onClick={handleGenerate}>
                        {activeTab === "link" ? "Shorten" : "Generate"}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Features */}
                    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-green-500" />
                        Free forever
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-green-500" />
                        No signup required
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-green-500" />
                        Analytics included
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Result */}
                    {activeTab === "link" ? (
                      <div className="space-y-4">
                        {/* Short URL Result */}
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                            <Check className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-green-700 font-medium">Your link is ready!</div>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg font-bold text-green-800 hover:underline flex items-center gap-1"
                            >
                              {shortUrl}
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                          <Button
                            variant={copied ? "default" : "outline"}
                            onClick={handleCopy}
                            className={copied ? "bg-green-600 hover:bg-green-600" : ""}
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Original URL */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-muted flex-shrink-0">Original:</span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary truncate flex-1 hover:underline">
                            {url}
                          </a>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1" onClick={handleReset}>
                            Shorten Another
                          </Button>
                          <Button className="flex-1" asChild>
                            <Link href="/signup">
                              Get Analytics
                              <BarChart3 className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* QR Code Result */}
                        <div className="flex flex-col items-center">
                          <div ref={qrRef} className="bg-white p-4 rounded-2xl border-2 border-gray-200 mb-4">
                            <QRCodeSVG
                              value={url}
                              size={192}
                              bgColor="#ffffff"
                              fgColor="#26065D"
                              level="H"
                              includeMargin={false}
                            />
                          </div>
                          <div className="text-sm text-muted mb-4 text-center">
                            Scan this QR code to visit:<br />
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                              {url.length > 40 ? url.substring(0, 40) + "..." : url}
                            </a>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1" onClick={handleReset}>
                            Generate Another
                          </Button>
                          <Button className="flex-1" onClick={handleDownloadQR}>
                            <Download className="h-4 w-4" />
                            Download PNG
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Stats below */}
            <div className="flex items-center justify-center gap-8 mt-6 text-center">
              <div>
                <div className="text-2xl font-bold text-dark">2B+</div>
                <div className="text-sm text-muted">Links created</div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-dark">500K+</div>
                <div className="text-sm text-muted">Users</div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-dark">150+</div>
                <div className="text-sm text-muted">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="container">
          <p className="text-center text-sm text-muted mb-4">
            Trusted by leading companies worldwide
          </p>
          <div className="flex items-center justify-center gap-10 flex-wrap opacity-50">
            {["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Industries", "Wayne Enterprises"].map((name) => (
              <span key={name} className="text-lg font-bold text-gray-900 tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Everything you need to manage links
            </h2>
            <p className="text-lg text-muted">
              A complete suite of tools to create, manage, and analyze your links and QR codes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Link2, title: "Link Management", desc: "Create branded short links with custom domains and advanced targeting options.", href: "/products/link-management" },
              { icon: QrCode, title: "QR Codes", desc: "Generate dynamic QR codes that you can update and track in real-time.", href: "/products/qr-codes" },
              { icon: BarChart3, title: "Analytics", desc: "Get deep insights into clicks, scans, locations, and device data.", href: "/products/analytics" },
              { icon: Plug, title: "Integrations", desc: "Connect with 100+ tools including Zapier, Slack, and HubSpot.", href: "/products/integrations" },
              { icon: FileText, title: "Pages", desc: "Build mobile-friendly landing pages without any coding required.", href: "/products/pages" },
              { icon: Zap, title: "API Access", desc: "Full REST API for developers to build custom integrations.", href: "/developers" },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group p-6 rounded-2xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-flex items-center text-sm font-medium text-primary">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-dark">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get started in 3 simple steps
            </h2>
            <p className="text-lg text-gray-400">
              Creating and tracking links has never been easier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: "1", title: "Paste your link", desc: "Enter any long URL and we'll instantly create a short, branded link." },
              { num: "2", title: "Customize & share", desc: "Add custom aliases, set expiration dates, and share everywhere." },
              { num: "3", title: "Track performance", desc: "Monitor clicks, locations, and conversions in real-time." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Enterprise-grade security
              </h2>
              <p className="text-lg text-muted mb-8">
                LinkForge is built with security at its core. We&apos;re SOC 2 Type II certified and GDPR compliant.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "SOC 2 Type II Certified",
                  "GDPR Compliant",
                  "99.99% Uptime SLA",
                  "End-to-end Encryption",
                  "SSO & SAML Support",
                  "Advanced Access Controls",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-dark">{item}</span>
                  </div>
                ))}
              </div>

              <Button asChild>
                <Link href="/trust">
                  Learn about our security
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: "SOC 2", sub: "Type II Certified" },
                { icon: Globe, label: "GDPR", sub: "Compliant" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-xl font-bold text-dark">{item.label}</div>
                  <div className="text-sm text-muted">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Loved by teams worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { quote: "LinkForge has transformed how we track our marketing campaigns. The analytics are incredibly detailed.", author: "Sarah Chen", role: "Marketing Director, TechFlow" },
              { quote: "We've seen a 40% increase in click-through rates since switching to branded links. Game changer!", author: "Michael Roberts", role: "Growth Lead, ScaleUp Labs" },
              { quote: "The QR code generator is fantastic. We use it for all our product packaging.", author: "Emily Watson", role: "Brand Manager, Retail Plus" },
            ].map((t) => (
              <div key={t.author} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-dark mb-6 leading-relaxed">&quot;{t.quote}&quot;</p>
                <div>
                  <div className="font-semibold text-dark">{t.author}</div>
                  <div className="text-sm text-muted">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-dark mb-2">
              Integrates with your favorite tools
            </h2>
            <p className="text-muted">Connect with 100+ apps and services</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Zapier", "Slack", "HubSpot", "Salesforce", "Google Analytics", "Shopify", "WordPress", "Mailchimp"].map((name) => (
              <div key={name} className="h-12 px-6 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                <span className="font-medium text-dark">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your links?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join 500,000+ businesses using LinkForge to create branded links, QR codes, and track performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
              <Link href="/signup">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/company/contact">Talk to sales</Link>
            </Button>
          </div>
          <p className="text-sm text-white/60">No credit card required · Free plan available</p>
        </div>
      </section>
    </>
  );
}
