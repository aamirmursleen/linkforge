import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

// Sample data for realistic testing
const SAMPLE_URLS = [
  { url: "https://example.com/summer-sale", title: "Summer Sale Campaign" },
  { url: "https://example.com/product-launch", title: "New Product Launch" },
  { url: "https://example.com/newsletter", title: "Newsletter Signup" },
  { url: "https://example.com/webinar", title: "Webinar Registration" },
  { url: "https://example.com/ebook", title: "Free eBook Download" },
  { url: "https://example.com/pricing", title: "Pricing Page" },
  { url: "https://example.com/demo", title: "Book a Demo" },
  { url: "https://example.com/blog", title: "Latest Blog Posts" },
];

const REFERRERS = [
  null, // direct
  "https://www.google.com/search?q=product",
  "https://www.facebook.com/",
  "https://t.co/abc123",
  "https://www.instagram.com/",
  "https://www.linkedin.com/feed/",
  "https://mail.google.com/",
  "https://www.bing.com/search?q=deal",
  "https://www.reddit.com/r/deals/",
  "https://www.youtube.com/watch?v=123",
];

const USER_AGENTS = [
  // Mobile
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
  // Desktop
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
  // Tablet
  "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  // Bot
  "Googlebot/2.1 (+http://www.google.com/bot.html)",
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
];

const COUNTRIES = ["US", "GB", "DE", "CA", "AU", "FR", "IN", "BR", "JP", "MX", null];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateShortCode(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function classifySource(referrer: string | null): string {
  if (!referrer) return "direct";
  const lower = referrer.toLowerCase();
  if (lower.includes("google")) return "google";
  if (lower.includes("facebook")) return "facebook";
  if (lower.includes("t.co") || lower.includes("twitter")) return "twitter";
  if (lower.includes("instagram")) return "instagram";
  if (lower.includes("linkedin")) return "linkedin";
  if (lower.includes("mail") || lower.includes("gmail")) return "email";
  if (lower.includes("bing")) return "bing";
  if (lower.includes("reddit")) return "reddit";
  if (lower.includes("youtube")) return "youtube";
  return "web";
}

function getHostname(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function parseUserAgent(ua: string): { deviceType: string; os: string; browser: string; isBot: boolean } {
  const isBot = /bot|crawler|spider|googlebot|facebookexternalhit/i.test(ua);

  if (isBot) {
    return { deviceType: "bot", os: "Bot", browser: "Bot", isBot: true };
  }

  let deviceType = "desktop";
  if (/mobile|android|iphone/i.test(ua)) deviceType = "mobile";
  if (/ipad|tablet/i.test(ua)) deviceType = "tablet";

  let os = "Unknown";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Unknown";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";

  return { deviceType, os, browser, isBot: false };
}

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.clickEvent.deleteMany();
  await prisma.shortLink.deleteMany();
  await prisma.user.deleteMany();

  // Create a test user
  console.log("👤 Creating test user...");
  const user = await prisma.user.create({
    data: {
      email: "demo@linkforge.io",
      name: "Demo User",
      password: "demo123",
      role: "admin",
    },
  });

  // Create short links
  console.log("🔗 Creating short links...");
  const links = await Promise.all(
    SAMPLE_URLS.map((sample) =>
      prisma.shortLink.create({
        data: {
          shortCode: generateShortCode(),
          longUrl: sample.url,
          title: sample.title,
          userId: user.id,
        },
      })
    )
  );

  console.log(`   Created ${links.length} short links`);

  // Generate click events for the past 90 days
  console.log("📊 Generating click events...");
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  const clickEvents: any[] = [];
  const usedIps = new Set<string>();

  // Generate unique IPs
  for (let i = 0; i < 500; i++) {
    usedIps.add(`192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`);
  }
  const ips = Array.from(usedIps);

  // Generate clicks with realistic distribution
  for (const link of links) {
    const linkIndex = links.indexOf(link);
    const baseClicks = 500 - linkIndex * 50;
    const numClicks = Math.max(50, baseClicks + Math.floor(Math.random() * 100));

    for (let i = 0; i < numClicks; i++) {
      const ip = randomElement(ips);
      const userAgent = randomElement(USER_AGENTS);
      const referrer = randomElement(REFERRERS);
      const country = randomElement(COUNTRIES);
      const clickedAt = randomDate(startDate, endDate);
      const parsed = parseUserAgent(userAgent);

      clickEvents.push({
        shortLinkId: link.id,
        clickedAt,
        referrer,
        referrerHost: getHostname(referrer),
        source: classifySource(referrer),
        userAgentRaw: userAgent,
        deviceType: parsed.deviceType,
        os: parsed.os,
        browser: parsed.browser,
        country,
        ipHash: hashIP(ip),
        isBot: parsed.isBot,
      });
    }
  }

  // Insert in batches
  const batchSize = 500;
  for (let i = 0; i < clickEvents.length; i += batchSize) {
    const batch = clickEvents.slice(i, i + batchSize);
    await prisma.clickEvent.createMany({ data: batch });
    console.log(`   Inserted ${Math.min(i + batchSize, clickEvents.length)}/${clickEvents.length} events`);
  }

  // Summary
  const totalClicks = await prisma.clickEvent.count();
  const totalLinks = await prisma.shortLink.count();

  console.log("\n✅ Seed completed!");
  console.log(`   📊 Total links: ${totalLinks}`);
  console.log(`   📈 Total click events: ${totalClicks}`);
  console.log(`   👤 Test user: demo@linkforge.io`);
  console.log("\n🚀 You can now start the dev server with 'npm run dev'");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
