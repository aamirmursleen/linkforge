import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { buildClickEventData } from "@/lib/analytics";
import {
  detectDevice,
  getDeepLinkUrl,
  appendUTMParams,
  checkLinkStatus,
  verifyPasswordSessionToken,
} from "@/lib/redirect";

// Rate limiting for redirects
const redirectRateLimitStore = new Map<string, { count: number; resetAt: number }>();
const REDIRECT_RATE_LIMIT = 1000;
const REDIRECT_RATE_WINDOW = 60 * 1000;

function checkRedirectRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = redirectRateLimitStore.get(ip);

  if (!record || record.resetAt < now) {
    redirectRateLimitStore.set(ip, { count: 1, resetAt: now + REDIRECT_RATE_WINDOW });
    return true;
  }

  if (record.count >= REDIRECT_RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Async tracking function
async function trackClick(
  shortLinkId: string,
  ip: string | null,
  userAgent: string | null | undefined,
  referrer: string | null | undefined
) {
  try {
    const eventData = buildClickEventData(ip, userAgent, referrer);

    await Promise.all([
      prisma.clickEvent.create({
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
      }),
      prisma.shortLink.update({
        where: { id: shortLinkId },
        data: {
          clickCount: { increment: 1 },
          lastClickedAt: new Date(),
        },
      }),
    ]);
  } catch (error) {
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

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    if (!checkRedirectRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Find short link (default domain - domainId is null)
    const link = await prisma.shortLink.findFirst({
      where: { shortCode: code, domainId: null },
      include: { domain: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Check link status (disabled, scheduled, expired, password)
    const statusCheck = checkLinkStatus({
      disabled: link.disabled,
      status: link.status,
      startsAt: link.startsAt,
      expiresAt: link.expiresAt,
      password: link.password,
    });

    if (!statusCheck.canAccess) {
      // Password protected
      if (statusCheck.status === "password_required") {
        const sessionToken = request.cookies.get(`lf_pw_${link.id}`)?.value;
        if (!sessionToken || !verifyPasswordSessionToken(sessionToken, link.id)) {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          return NextResponse.redirect(`${baseUrl}/p/${code}`, { status: 302 });
        }
      } else {
        return NextResponse.json(
          { error: statusCheck.message },
          { status: statusCheck.status === "expired" ? 410 : 403 }
        );
      }
    }

    const userAgent = request.headers.get("user-agent");
    const referrer = request.headers.get("referer") || request.headers.get("referrer");
    const device = detectDevice(userAgent);

    let redirectUrl = link.longUrl;

    // Mobile deep linking
    if ((device.os === "ios" || device.os === "android") && (link.iosScheme || link.androidScheme)) {
      redirectUrl = getDeepLinkUrl(device, {
        iosScheme: link.iosScheme,
        iosAppStore: link.iosAppStore,
        androidScheme: link.androidScheme,
        androidPlay: link.androidPlay,
      }, link.longUrl);
    }

    // Append UTM parameters
    if (link.utmSource || link.utmMedium || link.utmCampaign) {
      redirectUrl = appendUTMParams(redirectUrl, {
        utmSource: link.utmSource,
        utmMedium: link.utmMedium,
        utmCampaign: link.utmCampaign,
        utmTerm: link.utmTerm,
        utmContent: link.utmContent,
      });
    }

    // Fire-and-forget tracking
    trackClick(link.id, ip, userAgent, referrer);

    // Redirect with configured status (301 or 302)
    const redirectStatus = link.redirectType === 301 ? 301 : 302;

    return NextResponse.redirect(redirectUrl, {
      status: redirectStatus,
      headers: {
        "Cache-Control": redirectStatus === 301
          ? "public, max-age=31536000"
          : "no-store, no-cache, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("Error in redirect:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
