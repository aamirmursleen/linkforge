import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateShortCode, isValidUrl } from "@/lib/analytics";

// Rate limiting simple in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || record.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// POST /api/links - Create a new short link
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { longUrl, title, customCode, expiresAt } = body;

    // Validate URL
    if (!longUrl || typeof longUrl !== "string") {
      return NextResponse.json(
        { error: "Long URL is required" },
        { status: 400 }
      );
    }

    if (!isValidUrl(longUrl)) {
      return NextResponse.json(
        { error: "Invalid URL. Only http and https URLs are allowed." },
        { status: 400 }
      );
    }

    // Handle custom code or generate one
    let shortCode: string;

    if (customCode) {
      // Validate custom code
      if (!/^[a-zA-Z0-9_-]{3,20}$/.test(customCode)) {
        return NextResponse.json(
          { error: "Custom code must be 3-20 characters and contain only letters, numbers, hyphens, and underscores." },
          { status: 400 }
        );
      }

      // Check if custom code already exists
      const existing = await prisma.shortLink.findUnique({
        where: { shortCode: customCode },
      });

      if (existing) {
        return NextResponse.json(
          { error: "This custom code is already taken. Please choose another." },
          { status: 409 }
        );
      }

      shortCode = customCode;
    } else {
      // Generate unique code with retry
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        shortCode = generateShortCode();
        const existing = await prisma.shortLink.findUnique({
          where: { shortCode },
        });

        if (!existing) break;
        attempts++;
      }

      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: "Failed to generate unique short code. Please try again." },
          { status: 500 }
        );
      }
    }

    // Parse expiration date if provided
    let expiresAtDate: Date | null = null;
    if (expiresAt) {
      expiresAtDate = new Date(expiresAt);
      if (isNaN(expiresAtDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiration date format." },
          { status: 400 }
        );
      }
      if (expiresAtDate <= new Date()) {
        return NextResponse.json(
          { error: "Expiration date must be in the future." },
          { status: 400 }
        );
      }
    }

    // Create the short link
    const shortLink = await prisma.shortLink.create({
      data: {
        shortCode: shortCode!,
        longUrl,
        title: title || null,
        expiresAt: expiresAtDate,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      success: true,
      data: {
        id: shortLink.id,
        shortCode: shortLink.shortCode,
        shortUrl: `${baseUrl}/r/${shortLink.shortCode}`,
        longUrl: shortLink.longUrl,
        title: shortLink.title,
        expiresAt: shortLink.expiresAt,
        createdAt: shortLink.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating short link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/links - List all short links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { shortCode: { contains: search } },
        { longUrl: { contains: search } },
        { title: { contains: search } },
      ];
    }

    // Get links with click count
    const [links, total] = await Promise.all([
      prisma.shortLink.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: { clickEvents: true },
          },
        },
      }),
      prisma.shortLink.count({ where }),
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      success: true,
      data: links.map((link) => ({
        id: link.id,
        shortCode: link.shortCode,
        shortUrl: `${baseUrl}/r/${link.shortCode}`,
        longUrl: link.longUrl,
        title: link.title,
        disabled: link.disabled,
        expiresAt: link.expiresAt,
        createdAt: link.createdAt,
        clickCount: link._count.clickEvents,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
