import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import { BioPageClient } from "./client";
import { UAParser } from "ua-parser-js";
import crypto from "crypto";

interface Props {
  params: Promise<{ slug: string }>;
}

// Helper to hash IP for privacy
function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
}

// Helper to detect bots
function isBot(userAgent: string): boolean {
  const botPatterns = /bot|crawler|spider|scraper|headless|phantom|selenium/i;
  return botPatterns.test(userAgent);
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const page = await prisma.page.findFirst({
    where: { slug, status: "published" },
  });

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.description || `${page.title} - Bio Link`,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.description || undefined,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}

export default async function BioPage({ params }: Props) {
  const { slug } = await params;

  const page = await prisma.page.findFirst({
    where: { slug, status: "published" },
  });

  if (!page) {
    notFound();
  }

  // Get request headers for analytics
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const referer = headersList.get("referer") || "";
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] ||
             headersList.get("x-real-ip") ||
             "unknown";

  // Parse user agent
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  // Determine device type
  let deviceType = "desktop";
  if (device.type === "mobile") deviceType = "mobile";
  else if (device.type === "tablet") deviceType = "tablet";

  // Extract referrer host
  let referrerHost = null;
  try {
    if (referer) {
      referrerHost = new URL(referer).hostname;
    }
  } catch {}

  // Detect source from referrer
  let source = "direct";
  if (referrerHost) {
    if (referrerHost.includes("instagram")) source = "instagram";
    else if (referrerHost.includes("twitter") || referrerHost.includes("x.com")) source = "twitter";
    else if (referrerHost.includes("facebook")) source = "facebook";
    else if (referrerHost.includes("linkedin")) source = "linkedin";
    else if (referrerHost.includes("youtube")) source = "youtube";
    else if (referrerHost.includes("tiktok")) source = "tiktok";
    else if (referrerHost.includes("google")) source = "google";
    else source = "referral";
  }

  const isBotRequest = isBot(userAgent);

  // Increment view count and record detailed analytics
  await Promise.all([
    prisma.page.update({
      where: { id: page.id },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.pageView.create({
      data: {
        pageId: page.id,
        referrer: referer || null,
        referrerHost,
        source,
        userAgentRaw: userAgent,
        deviceType,
        os: os.name || null,
        browser: browser.name || null,
        ipHash: ip !== "unknown" ? hashIP(ip) : null,
        isBot: isBotRequest,
      },
    }),
  ]);

  const blocks = JSON.parse(page.blocks);

  return (
    <BioPageClient
      page={{
        ...page,
        blocks,
      }}
    />
  );
}
