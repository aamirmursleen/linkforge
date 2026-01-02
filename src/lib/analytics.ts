import { createHash } from "crypto";
import { UAParser } from "ua-parser-js";
import { customAlphabet } from "nanoid";

// ============================================
// SHORT CODE GENERATION
// ============================================

// Base62 alphabet for URL-safe short codes
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateCode = customAlphabet(ALPHABET, 7);

export function generateShortCode(): string {
  return generateCode();
}

// ============================================
// URL VALIDATION
// ============================================

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http and https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    // Block javascript: and data: URLs
    if (url.toLowerCase().startsWith("javascript:") || url.toLowerCase().startsWith("data:")) {
      return false;
    }
    // Block localhost and private IPs in production
    const hostname = parsed.hostname.toLowerCase();
    if (process.env.NODE_ENV === "production") {
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.16.") ||
        hostname.endsWith(".local")
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

// ============================================
// IP HASHING (Privacy)
// ============================================

export function hashIP(ip: string): string {
  const salt = process.env.ANALYTICS_IP_SALT || "default-salt-change-me";
  return createHash("sha256")
    .update(ip + salt)
    .digest("hex")
    .substring(0, 32); // Truncate for storage efficiency
}

// ============================================
// BOT DETECTION
// ============================================

const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /crawling/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /webdriver/i,
  /puppeteer/i,
  /lighthouse/i,
  /pagespeed/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /baiduspider/i,
  /duckduckbot/i,
  /slurp/i,
  /ia_archiver/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /slackbot/i,
  /telegrambot/i,
  /discordbot/i,
  /applebot/i,
  /mediapartners/i,
  /adsbot/i,
  /feedfetcher/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /axios/i,
  /node-fetch/i,
  /go-http-client/i,
  /java/i,
  /okhttp/i,
];

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

// ============================================
// USER AGENT PARSING
// ============================================

export interface ParsedUserAgent {
  deviceType: "mobile" | "desktop" | "tablet" | "bot" | "unknown";
  os: string | null;
  browser: string | null;
  isBot: boolean;
}

export function parseUserAgent(userAgent: string | null | undefined): ParsedUserAgent {
  if (!userAgent) {
    return {
      deviceType: "unknown",
      os: null,
      browser: null,
      isBot: false,
    };
  }

  const isBotUA = isBot(userAgent);

  if (isBotUA) {
    return {
      deviceType: "bot",
      os: null,
      browser: null,
      isBot: true,
    };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let deviceType: ParsedUserAgent["deviceType"] = "unknown";
  const deviceTypeRaw = result.device.type;

  if (deviceTypeRaw === "mobile") {
    deviceType = "mobile";
  } else if (deviceTypeRaw === "tablet") {
    deviceType = "tablet";
  } else if (result.os.name) {
    // If no device type but has OS, assume desktop
    deviceType = "desktop";
  }

  return {
    deviceType,
    os: result.os.name || null,
    browser: result.browser.name || null,
    isBot: false,
  };
}

// ============================================
// SOURCE/REFERRER CLASSIFICATION
// ============================================

export type TrafficSource =
  | "direct"
  | "google"
  | "bing"
  | "duckduckgo"
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "pinterest"
  | "reddit"
  | "whatsapp"
  | "telegram"
  | "email"
  | "social"
  | "search"
  | "web";

const REFERRER_RULES: { pattern: RegExp; source: TrafficSource }[] = [
  // Search engines
  { pattern: /google\./i, source: "google" },
  { pattern: /bing\./i, source: "bing" },
  { pattern: /duckduckgo\./i, source: "duckduckgo" },
  { pattern: /yahoo\./i, source: "search" },
  { pattern: /baidu\./i, source: "search" },
  { pattern: /yandex\./i, source: "search" },

  // Social media
  { pattern: /facebook\.com|fb\.com|fbcdn\.net/i, source: "facebook" },
  { pattern: /instagram\.com|cdninstagram\.com/i, source: "instagram" },
  { pattern: /twitter\.com|t\.co|x\.com/i, source: "twitter" },
  { pattern: /linkedin\.com|lnkd\.in/i, source: "linkedin" },
  { pattern: /tiktok\.com/i, source: "tiktok" },
  { pattern: /youtube\.com|youtu\.be/i, source: "youtube" },
  { pattern: /pinterest\./i, source: "pinterest" },
  { pattern: /reddit\.com/i, source: "reddit" },

  // Messaging
  { pattern: /whatsapp\./i, source: "whatsapp" },
  { pattern: /telegram\./i, source: "telegram" },
  { pattern: /discord\./i, source: "social" },

  // Email
  { pattern: /mail\./i, source: "email" },
  { pattern: /gmail\./i, source: "email" },
  { pattern: /outlook\./i, source: "email" },
  { pattern: /yahoo\.com\/mail/i, source: "email" },
  { pattern: /mailchimp\./i, source: "email" },
  { pattern: /sendgrid\./i, source: "email" },
];

export function classifySource(referrer: string | null | undefined): TrafficSource {
  if (!referrer || referrer.trim() === "") {
    return "direct";
  }

  const lowerReferrer = referrer.toLowerCase();

  for (const rule of REFERRER_RULES) {
    if (rule.pattern.test(lowerReferrer)) {
      return rule.source;
    }
  }

  // Check if it's a search engine we missed
  if (lowerReferrer.includes("search")) {
    return "search";
  }

  return "web";
}

export function extractHostname(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return null;
  }
}

// ============================================
// SOURCE CATEGORY (for grouping in dashboard)
// ============================================

export function getSourceCategory(source: TrafficSource): string {
  switch (source) {
    case "google":
    case "bing":
    case "duckduckgo":
    case "search":
      return "Search";
    case "facebook":
    case "instagram":
    case "twitter":
    case "linkedin":
    case "tiktok":
    case "youtube":
    case "pinterest":
    case "reddit":
    case "whatsapp":
    case "telegram":
    case "social":
      return "Social";
    case "email":
      return "Email";
    case "direct":
      return "Direct";
    case "web":
    default:
      return "Web";
  }
}

// ============================================
// DATE RANGE HELPERS
// ============================================

export function getDateRange(range: string): { start: Date; end: Date } {
  const end = new Date();
  let start = new Date();

  switch (range) {
    case "1h":
      start.setHours(start.getHours() - 1);
      break;
    case "24h":
      start.setHours(start.getHours() - 24);
      break;
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    case "90d":
      start.setDate(start.getDate() - 90);
      break;
    case "1y":
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setDate(start.getDate() - 30); // Default 30 days
  }

  return { start, end };
}

// ============================================
// CLICK EVENT DATA BUILDER
// ============================================

export interface ClickEventData {
  referrer: string | null;
  referrerHost: string | null;
  source: TrafficSource;
  userAgentRaw: string | null;
  deviceType: string;
  os: string | null;
  browser: string | null;
  ipHash: string | null;
  isBot: boolean;
  country: string | null;
}

export function buildClickEventData(
  ip: string | null,
  userAgent: string | null | undefined,
  referrer: string | null | undefined
): ClickEventData {
  const parsedUA = parseUserAgent(userAgent);
  const source = classifySource(referrer);
  const referrerHost = extractHostname(referrer);

  return {
    referrer: referrer || null,
    referrerHost,
    source,
    userAgentRaw: userAgent || null,
    deviceType: parsedUA.deviceType,
    os: parsedUA.os,
    browser: parsedUA.browser,
    ipHash: ip ? hashIP(ip) : null,
    isBot: parsedUA.isBot,
    country: null, // Will be set by geo lookup if available
  };
}
