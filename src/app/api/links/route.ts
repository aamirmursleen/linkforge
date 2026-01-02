import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateShortCode, isValidUrl } from "@/lib/analytics";
import { buildShortUrl } from "@/lib/domains";
import { hashPassword } from "@/lib/redirect";

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || record.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

const RESERVED_CODES = ["app", "api", "admin", "settings", "login", "signup", "r", "p", "qr"];

// POST /api/links - Create a new short link
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const {
      longUrl, title, description, customCode, domainId, folderId, workspaceId,
      redirectType = 302, startsAt, expiresAt, password,
      iosScheme, iosAppStore, androidScheme, androidPlay,
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent, tags,
    } = body;

    if (!longUrl || typeof longUrl !== "string") {
      return NextResponse.json({ error: "Long URL is required" }, { status: 400 });
    }

    if (!isValidUrl(longUrl)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (redirectType && ![301, 302].includes(redirectType)) {
      return NextResponse.json({ error: "Redirect type must be 301 or 302" }, { status: 400 });
    }

    let domain = null;
    if (domainId) {
      domain = await prisma.domain.findUnique({ where: { id: domainId } });
      if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
      if (domain.status !== "verified") {
        return NextResponse.json({ error: "Domain must be verified" }, { status: 400 });
      }
    }

    let shortCode: string;
    if (customCode) {
      if (!/^[a-zA-Z0-9_-]{3,50}$/.test(customCode)) {
        return NextResponse.json({ error: "Invalid custom code format" }, { status: 400 });
      }
      if (RESERVED_CODES.includes(customCode.toLowerCase())) {
        return NextResponse.json({ error: "This code is reserved" }, { status: 400 });
      }
      const existing = await prisma.shortLink.findFirst({
        where: { shortCode: customCode, domainId: domainId || null },
      });
      if (existing) {
        return NextResponse.json({ error: "Code already taken" }, { status: 409 });
      }
      shortCode = customCode;
    } else {
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        const existing = await prisma.shortLink.findFirst({
          where: { shortCode, domainId: domainId || null },
        });
        if (!existing) break;
        attempts++;
      } while (attempts < 5);
      if (attempts >= 5) {
        return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
      }
    }

    let startsAtDate: Date | null = null;
    let expiresAtDate: Date | null = null;

    if (startsAt) {
      startsAtDate = new Date(startsAt);
      if (isNaN(startsAtDate.getTime())) {
        return NextResponse.json({ error: "Invalid start date" }, { status: 400 });
      }
    }

    if (expiresAt) {
      expiresAtDate = new Date(expiresAt);
      if (isNaN(expiresAtDate.getTime()) || expiresAtDate <= new Date()) {
        return NextResponse.json({ error: "Invalid expiration date" }, { status: 400 });
      }
    }

    let status = "active";
    if (startsAtDate && startsAtDate > new Date()) status = "scheduled";

    const hashedPassword = password ? hashPassword(password) : null;

    const shortLink = await prisma.shortLink.create({
      data: {
        shortCode,
        longUrl,
        title: title || null,
        description: description || null,
        domainId: domainId || null,
        folderId: folderId || null,
        workspaceId: workspaceId || null,
        redirectType: redirectType || 302,
        status,
        startsAt: startsAtDate,
        expiresAt: expiresAtDate,
        password: hashedPassword,
        iosScheme: iosScheme || null,
        iosAppStore: iosAppStore || null,
        androidScheme: androidScheme || null,
        androidPlay: androidPlay || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmTerm: utmTerm || null,
        utmContent: utmContent || null,
      },
      include: { domain: true, folder: true },
    });

    if (tags && Array.isArray(tags) && tags.length > 0 && workspaceId) {
      for (const tagName of tags) {
        let tag = await prisma.tag.findFirst({ where: { workspaceId, name: tagName } });
        if (!tag) tag = await prisma.tag.create({ data: { workspaceId, name: tagName } });
        await prisma.linkTag.create({ data: { linkId: shortLink.id, tagId: tag.id } });
      }
    }

    const shortUrl = buildShortUrl(shortCode, domain?.domain);

    return NextResponse.json({
      success: true,
      data: {
        id: shortLink.id,
        shortCode: shortLink.shortCode,
        shortUrl,
        longUrl: shortLink.longUrl,
        title: shortLink.title,
        domain: shortLink.domain?.domain || null,
        redirectType: shortLink.redirectType,
        status: shortLink.status,
        startsAt: shortLink.startsAt,
        expiresAt: shortLink.expiresAt,
        hasPassword: !!shortLink.password,
        createdAt: shortLink.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/links - List short links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const workspaceId = searchParams.get("workspaceId");
    const folderId = searchParams.get("folderId");
    const domainId = searchParams.get("domainId");
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const archived = searchParams.get("archived") === "true";

    const skip = (page - 1) * limit;
    const where: any = { archived };

    if (workspaceId) where.workspaceId = workspaceId;
    if (folderId) where.folderId = folderId;
    if (domainId) where.domainId = domainId;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { shortCode: { contains: search } },
        { longUrl: { contains: search } },
        { title: { contains: search } },
      ];
    }

    if (tag) {
      where.tags = { some: { tag: { name: tag } } };
    }

    const [links, total] = await Promise.all([
      prisma.shortLink.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          domain: true,
          folder: true,
          tags: { include: { tag: true } },
          _count: { select: { clickEvents: true } },
        },
      }),
      prisma.shortLink.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: links.map((link) => ({
        id: link.id,
        shortCode: link.shortCode,
        shortUrl: buildShortUrl(link.shortCode, link.domain?.domain),
        longUrl: link.longUrl,
        title: link.title,
        domain: link.domain?.domain || null,
        folder: link.folder ? { id: link.folder.id, name: link.folder.name } : null,
        tags: link.tags.map((lt) => ({ id: lt.tag.id, name: lt.tag.name, color: lt.tag.color })),
        redirectType: link.redirectType,
        status: link.status,
        disabled: link.disabled,
        archived: link.archived,
        startsAt: link.startsAt,
        expiresAt: link.expiresAt,
        hasPassword: !!link.password,
        clickCount: link.clickCount,
        lastClickedAt: link.lastClickedAt,
        createdAt: link.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
