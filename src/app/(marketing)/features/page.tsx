"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Link2,
  QrCode,
  BarChart3,
  Tag,
  FileText,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Wifi,
  Mail,
  MessageSquare,
  Palette,
  Download,
  Globe,
  Users,
  MousePointer,
  Clock,
  Lock,
  Zap,
  Target,
  TrendingUp,
  Layers,
  Image,
  Type,
  Phone,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoModal } from "@/components/ui/video-modal";

type Tab = "features" | "guide";

const features = [
  {
    id: "link-shortener",
    icon: Link2,
    title: "Link Shortener",
    tagline: "Make long links short and easy to share",
    color: "bg-blue-500",
    description: "Turn any long URL into a short, branded link that's easy to remember and share.",
    capabilities: [
      { icon: Zap, text: "Turn long URLs into short links instantly" },
      { icon: Tag, text: "Add custom names (like 'my-sale' instead of random letters)" },
      { icon: Lock, text: "Add password protection for private links" },
      { icon: Clock, text: "Set expiry dates so links stop working automatically" },
      { icon: MousePointer, text: "Track how many people clicked your link" },
      { icon: Target, text: "See where your clicks come from" },
    ],
  },
  {
    id: "qr-codes",
    icon: QrCode,
    title: "QR Code Maker",
    tagline: "Create scannable QR codes for anything",
    color: "bg-purple-500",
    description: "Generate beautiful QR codes that people can scan with their phone camera.",
    capabilities: [
      { icon: Globe, text: "Website Link - Opens a website when scanned" },
      { icon: Users, text: "Contact Card - Saves name and phone to their phone" },
      { icon: Wifi, text: "WiFi - Connect to WiFi without typing password" },
      { icon: MessageSquare, text: "SMS - Opens a text message ready to send" },
      { icon: Mail, text: "Email - Opens an email ready to send" },
      { icon: Type, text: "Plain Text - Shows any message you want" },
    ],
    extras: [
      { icon: Palette, text: "Pick any colors for your QR code" },
      { icon: Layers, text: "Add frames with custom text" },
      { icon: Download, text: "Download as PNG or SVG image" },
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics Dashboard",
    tagline: "See how your links are doing",
    color: "bg-green-500",
    description: "Get detailed stats about who clicks your links, when, and from where.",
    capabilities: [
      { icon: MousePointer, text: "Total clicks on all your links" },
      { icon: Globe, text: "Which countries people are from" },
      { icon: Smartphone, text: "What device they use (phone, computer, tablet)" },
      { icon: Globe, text: "What browser they use (Chrome, Safari, Firefox)" },
      { icon: Share2, text: "Where people came from (Google, Facebook, Twitter)" },
      { icon: Clock, text: "Heat map showing when people click the most" },
    ],
    timeOptions: ["Last 1 hour", "Last 24 hours", "Last 7 days", "Last 30 days", "Last 90 days"],
  },
  {
    id: "utm-builder",
    icon: Tag,
    title: "UTM Builder",
    tagline: "Track where your clicks come from",
    color: "bg-orange-500",
    description: "Add tracking tags to your links so you know which ad or post brought people to your website.",
    capabilities: [
      { icon: Target, text: "Source - Where the link is shared (Facebook, Google)" },
      { icon: Share2, text: "Medium - How it's shared (email, post, ad)" },
      { icon: Tag, text: "Campaign - Name of your campaign (summer-sale)" },
      { icon: Type, text: "Term - Keywords for paid ads" },
      { icon: Layers, text: "Content - Test different versions" },
    ],
    presets: ["Facebook", "Twitter", "Instagram", "Google Ads", "Email", "TikTok"],
  },
  {
    id: "bio-pages",
    icon: FileText,
    title: "Bio Pages",
    tagline: "All your links in one place",
    color: "bg-pink-500",
    description: "Create a beautiful page with all your important links. Perfect for Instagram or TikTok bio.",
    capabilities: [
      { icon: Type, text: "Header - A title with your name or brand" },
      { icon: Link2, text: "Link - Buttons that go to websites" },
      { icon: Share2, text: "Social - Icons for your social media" },
      { icon: Type, text: "Text - Write anything you want" },
      { icon: Layers, text: "Divider - Lines to separate sections" },
      { icon: Image, text: "Image - Add pictures" },
      { icon: Phone, text: "Contact - Show email or phone" },
    ],
    themes: ["Light", "Dark", "Gradient", "Minimal", "Neon"],
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    tagline: "See everything at a glance",
    color: "bg-indigo-500",
    description: "Your home base showing all your important stats and quick actions.",
    capabilities: [
      { icon: TrendingUp, text: "Total clicks on all links" },
      { icon: Link2, text: "Number of active links" },
      { icon: QrCode, text: "QR code scans" },
      { icon: Target, text: "Conversion rate" },
      { icon: Clock, text: "Your recent links" },
      { icon: Zap, text: "Quick buttons to create links" },
    ],
  },
];

const guides = [
  {
    id: "create-link",
    title: "How to Make a Short Link",
    icon: Link2,
    steps: [
      { step: 1, title: "Open Links Page", description: "Click on 'Links' in the menu on the left side" },
      { step: 2, title: "Click Create Button", description: "Click the blue button that says 'Create Link'" },
      { step: 3, title: "Fill the Form", items: [
        "Title - Give your link a name (like 'My YouTube Video')",
        "Destination URL - Paste your long link here",
        "Custom Alias - (Optional) Type a short name you want",
        "Password - (Optional) Add a password if you want",
        "Expiry Date - (Optional) Pick when the link should stop working",
      ]},
      { step: 4, title: "Create It", description: "Click 'Create Link' button" },
      { step: 5, title: "Copy Your Link", description: "Your new link is ready! Click the copy button to copy it" },
    ],
  },
  {
    id: "create-qr",
    title: "How to Make a QR Code",
    icon: QrCode,
    steps: [
      { step: 1, title: "Open QR Code Page", description: "Click on 'QR Code' in the menu" },
      { step: 2, title: "Pick Type", description: "Choose what type of QR code you want: URL, Contact, WiFi, SMS, Email, or Text" },
      { step: 3, title: "Add Information", items: [
        "For URL: paste your website link",
        "For Contact: type name and phone number",
        "For WiFi: type network name and password",
        "For SMS: type phone number and message",
        "For Email: type email address and subject",
        "For Text: type your message",
      ]},
      { step: 4, title: "Pick Colors (Optional)", description: "Choose a color for your QR code and background" },
      { step: 5, title: "Add Frame (Optional)", description: "Choose a frame style and write text like 'Scan Me!'" },
      { step: 6, title: "Download", description: "Click 'Download PNG' or 'Download SVG' to save it" },
    ],
  },
  {
    id: "view-analytics",
    title: "How to See Your Analytics",
    icon: BarChart3,
    steps: [
      { step: 1, title: "Open Analytics", description: "Click on 'Analytics' in the menu" },
      { step: 2, title: "Pick Time Range", items: [
        "1H = Last 1 hour",
        "24H = Last 24 hours",
        "7D = Last 7 days",
        "30D = Last 30 days",
        "90D = Last 90 days",
      ]},
      { step: 3, title: "Look at the Cards", items: [
        "Total Clicks - How many times your links were clicked",
        "Unique Visitors - How many different people clicked",
        "Countries - Where people are from",
        "Top Referrer - Where most people came from",
      ]},
      { step: 4, title: "See the Charts", description: "Scroll down to see charts for clicks over time, devices, browsers, countries, and heat map" },
    ],
  },
  {
    id: "use-utm",
    title: "How to Use UTM Builder",
    icon: Tag,
    steps: [
      { step: 1, title: "Open UTM Builder", description: "Click on 'UTM Builder' in the menu" },
      { step: 2, title: "Paste Your Link", description: "Put your website link in the first box" },
      { step: 3, title: "Use Quick Preset OR Fill Manually", items: [
        "Quick way: Click 'Facebook', 'Twitter', or any button to auto-fill",
        "Manual way: Fill in Source, Medium, Campaign yourself",
      ]},
      { step: 4, title: "Fill the Fields (if manual)", items: [
        "Source: Where you'll share it (facebook, google)",
        "Medium: How you'll share it (social, email)",
        "Campaign: Your campaign name (summer-sale)",
      ]},
      { step: 5, title: "Copy Final URL", description: "Copy the link from the green box at the bottom" },
      { step: 6, title: "Save (Optional)", description: "Click 'Save as Preset' to save for next time" },
    ],
  },
  {
    id: "create-bio",
    title: "How to Make a Bio Page",
    icon: FileText,
    steps: [
      { step: 1, title: "Open Bio Pages", description: "Click on 'Bio Pages' in the menu" },
      { step: 2, title: "Create New Page", description: "Click 'Create New Page' button" },
      { step: 3, title: "Set Up Page", description: "Give your page a name and pick a theme (Light, Dark, etc.)" },
      { step: 4, title: "Add Blocks", items: [
        "Click 'Header' to add a title",
        "Click 'Link' to add a button",
        "Click 'Social' to add social media icons",
        "Click 'Text' to add words",
        "Click 'Image' to add a picture",
      ]},
      { step: 5, title: "Edit Blocks", description: "Click on any block to change what it says" },
      { step: 6, title: "Arrange Blocks", description: "Drag blocks up or down to change the order" },
      { step: 7, title: "Preview", description: "Click 'Preview' to see how it looks" },
      { step: 8, title: "Share", description: "Copy the link and put it in your Instagram or TikTok bio" },
    ],
  },
];

const tips = [
  { icon: Tag, title: "Use good names", description: "Give your links clear names so you remember what they are" },
  { icon: BarChart3, title: "Check your stats", description: "Look at analytics every week to see what's working" },
  { icon: Target, title: "Use UTM tags", description: "Add UTM tags to know which social media brings the most clicks" },
  { icon: Palette, title: "Make it pretty", description: "Use colors on your QR codes that match your brand" },
  { icon: Zap, title: "Keep it simple", description: "Don't add too many blocks to your bio page" },
];

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("features");
  const [expandedGuide, setExpandedGuide] = useState<string | null>("create-link");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-16 md:py-24">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Complete Guide</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--dark)] mb-6">
            Everything You Need to
            <br />
            <span className="gradient-text">Manage Your Links</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto mb-8">
            LinkForge gives you powerful tools to shorten links, create QR codes,
            track analytics, and build bio pages. All in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            {/* Video Demo Modal - Add your YouTube video ID below */}
            <VideoModal
              youtubeId="YOUR_YOUTUBE_VIDEO_ID"
              buttonText="Watch Demo"
              variant="outline"
              size="lg"
            />
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-16 z-40 bg-white border-b border-[var(--border)]">
        <div className="container">
          <div className="flex gap-1 py-2">
            <button
              onClick={() => setActiveTab("features")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "features"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:text-[var(--dark)] hover:bg-[var(--border)]"
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "guide"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:text-[var(--dark)] hover:bg-[var(--border)]"
              }`}
            >
              How to Use
            </button>
          </div>
        </div>
      </section>

      {/* Features Tab Content */}
      {activeTab === "features" && (
        <section className="py-16">
          <div className="container">
            {/* Feature Cards */}
            <div className="space-y-16">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  id={feature.id}
                  className={`scroll-mt-32 ${index % 2 === 1 ? "bg-[var(--primary-pale)] -mx-4 px-4 md:-mx-8 md:px-8 py-12 rounded-2xl" : ""}`}
                >
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    {/* Left - Icon & Title */}
                    <div className="lg:w-1/3">
                      <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color} mb-4`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-[var(--dark)] mb-2">
                        {feature.title}
                      </h2>
                      <p className="text-lg text-[var(--primary)] font-medium mb-4">
                        {feature.tagline}
                      </p>
                      <p className="text-[var(--muted)]">
                        {feature.description}
                      </p>
                    </div>

                    {/* Right - Capabilities */}
                    <div className="lg:w-2/3">
                      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                        <h3 className="font-semibold text-[var(--dark)] mb-4">What you can do:</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {feature.capabilities.map((cap, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <cap.icon className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="text-[var(--dark)] text-sm pt-1">{cap.text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Extras for QR Codes */}
                        {feature.extras && (
                          <div className="mt-6 pt-6 border-t border-[var(--border)]">
                            <h4 className="font-medium text-[var(--dark)] mb-3">Plus:</h4>
                            <div className="flex flex-wrap gap-3">
                              {feature.extras.map((extra, i) => (
                                <div key={i} className="flex items-center gap-2 bg-[var(--primary-pale)] px-3 py-2 rounded-lg">
                                  <extra.icon className="h-4 w-4 text-[var(--primary)]" />
                                  <span className="text-sm text-[var(--dark)]">{extra.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Time Options for Analytics */}
                        {feature.timeOptions && (
                          <div className="mt-6 pt-6 border-t border-[var(--border)]">
                            <h4 className="font-medium text-[var(--dark)] mb-3">Time options:</h4>
                            <div className="flex flex-wrap gap-2">
                              {feature.timeOptions.map((time, i) => (
                                <Badge key={i} variant="outline">{time}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Presets for UTM */}
                        {feature.presets && (
                          <div className="mt-6 pt-6 border-t border-[var(--border)]">
                            <h4 className="font-medium text-[var(--dark)] mb-3">Quick presets:</h4>
                            <div className="flex flex-wrap gap-2">
                              {feature.presets.map((preset, i) => (
                                <Badge key={i} variant="secondary">{preset}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Themes for Bio Pages */}
                        {feature.themes && (
                          <div className="mt-6 pt-6 border-t border-[var(--border)]">
                            <h4 className="font-medium text-[var(--dark)] mb-3">Themes:</h4>
                            <div className="flex flex-wrap gap-2">
                              {feature.themes.map((theme, i) => (
                                <Badge key={i} variant="secondary">{theme}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-16 bg-[var(--dark)] rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to try these features?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Start using LinkForge today. No credit card needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
                  <Link href="/signup">Create Free Account</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/app">Open Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Guide Tab Content */}
      {activeTab === "guide" && (
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Guide Accordion */}
              <div className="space-y-4">
                {guides.map((guide) => (
                  <div
                    key={guide.id}
                    className="bg-white rounded-xl border border-[var(--border)] overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                      className="w-full flex items-center gap-4 p-6 text-left hover:bg-[var(--border)]/30 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-xl bg-[var(--primary-pale)] flex items-center justify-center flex-shrink-0">
                        <guide.icon className="h-6 w-6 text-[var(--primary)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--dark)]">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-[var(--muted)]">
                          {guide.steps.length} easy steps
                        </p>
                      </div>
                      <div className={`transform transition-transform ${expandedGuide === guide.id ? "rotate-180" : ""}`}>
                        <svg className="h-5 w-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {expandedGuide === guide.id && (
                      <div className="px-6 pb-6 border-t border-[var(--border)]">
                        <div className="pt-6 space-y-6">
                          {guide.steps.map((step) => (
                            <div key={step.step} className="flex gap-4">
                              <div className="h-8 w-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {step.step}
                              </div>
                              <div className="flex-1 pt-1">
                                <h4 className="font-medium text-[var(--dark)] mb-1">
                                  {step.title}
                                </h4>
                                {step.description && (
                                  <p className="text-[var(--muted)] text-sm">
                                    {step.description}
                                  </p>
                                )}
                                {step.items && (
                                  <ul className="mt-2 space-y-2">
                                    {step.items.map((item, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tips Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-[var(--dark)] mb-6 text-center">
                  Tips and Tricks
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tips.map((tip, i) => (
                    <div key={i} className="bg-[var(--primary-pale)] rounded-xl p-5">
                      <div className="h-10 w-10 rounded-lg bg-[var(--primary)] flex items-center justify-center mb-3">
                        <tip.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-[var(--dark)] mb-1">{tip.title}</h3>
                      <p className="text-sm text-[var(--muted)]">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-12 bg-[var(--border)]/50 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold text-[var(--dark)] mb-2">
                  Need More Help?
                </h3>
                <p className="text-[var(--muted)] mb-4">
                  If something is not working, try refreshing the page or clearing your browser cache.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/company/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
