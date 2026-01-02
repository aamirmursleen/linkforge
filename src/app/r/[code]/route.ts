import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { buildClickEventData } from "@/lib/analytics";

// Rate limiting for redirects (prevent abuse)
const redirectRateLimitStore = new Map<string, { count: number; resetAt: number }>();
const REDIRECT_RATE_LIMIT = 1000; // per minute per IP
const REDIRECT_RATE_WINDOW = 60 * 1000;

function checkRedirectRateLimit(ipHash: string): boolean {
  const now = Date.now();
  const record = redirectRateLimitStore.get(ipHash);

  if (!record || record.resetAt < now) {
    redirectRateLimitStore.set(ipHash, { count: 1, resetAt: now + REDIRECT_RATE_WINDOW });
    return true;
  }

  if (record.count >= REDIRECT_RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Async tracking function (fire-and-forget)
async function trackClick(
  shortLinkId: string,
  ip: string | null,
  userAgent: string | null | undefined,
  referrer: string | null | undefined
) {
  try {
    const eventData = buildClickEventData(ip, userAgent, referrer);

    await prisma.clickEvent.create({
      data: {
        shortLinkId,
        referrer: eventData.referrer,
        referrerHost: eventData.referrerHost,
        source: eventData.source,
        userAgentRaw: eventData.userAgentRaw,
        deviceType: eventData.deviceType,
        os: eventData.os,
        browser: eventData.browser,
        ipHash: eventData.ipHash,
        isBot: eventData.isBot,
        country: eventData.country,
      },
    });
  } catch (error) {
    // Log error but don't fail - tracking should not block redirect
    console.error("Error tracking click:", error);
  }
}

// GET /r/[code] - Redirect and track
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Simple rate limit check
    const ipHash = ip; // We'll use raw IP for rate limiting, hash for storage
    if (!checkRedirectRateLimit(ipHash)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Find the short link
    const link = await prisma.shortLink.findUnique({
      where: { shortCode: code },
    });

    // Link not found
    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Link is disabled
    if (link.disabled) {
      return NextResponse.json(
        { error: "This link has been disabled" },
        { status: 410 } // Gone
      );
    }

    // Link has expired
    if (link.expiresAt && link.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 } // Gone
      );
    }

    // Get tracking data from headers
    const userAgent = request.headers.get("user-agent");
    const referrer = request.headers.get("referer") || request.headers.get("referrer");

    // Fire-and-forget tracking (don't await)
    // Using Promise.resolve().then() to ensure it runs after response
    trackClick(link.id, ip, userAgent, referrer);

    // Redirect immediately (302 for temporary redirect, allows analytics tracking)
    return NextResponse.redirect(link.longUrl, {
      status: 302,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });

  } catch (error) {
    console.error("Error in redirect:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
