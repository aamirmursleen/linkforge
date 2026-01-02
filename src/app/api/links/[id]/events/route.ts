import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getDateRange } from "@/lib/analytics";

// GET /api/links/[id]/events - Get raw click events (paginated)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // Parse query params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const range = searchParams.get("range") || "30d";
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const includeBots = searchParams.get("includeBots") === "true";
    const exportCsv = searchParams.get("export") === "csv";

    // Check if link exists
    const link = await prisma.shortLink.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Determine date range
    let startDate: Date;
    let endDate: Date;

    if (fromParam && toParam) {
      startDate = new Date(fromParam);
      endDate = new Date(toParam);
    } else {
      const { start, end } = getDateRange(range);
      startDate = start;
      endDate = end;
    }

    // Build where clause
    const where: any = {
      shortLinkId: id,
      clickedAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (!includeBots) {
      where.isBot = false;
    }

    const skip = (page - 1) * limit;

    // For CSV export, get all events
    if (exportCsv) {
      const allEvents = await prisma.clickEvent.findMany({
        where,
        orderBy: { clickedAt: "desc" },
        take: 10000, // Limit export to 10k rows
      });

      // Generate CSV
      const headers = [
        "Timestamp",
        "Device",
        "Browser",
        "OS",
        "Country",
        "Source",
        "Referrer",
        "Is Bot",
      ];

      const rows = allEvents.map((event) => [
        event.clickedAt.toISOString(),
        event.deviceType || "",
        event.browser || "",
        event.os || "",
        event.country || "",
        event.source || "",
        event.referrerHost || "",
        event.isBot ? "Yes" : "No",
      ]);

      const csv = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="events-${link.shortCode}-${range}.csv"`,
        },
      });
    }

    // Get paginated events
    const [events, total] = await Promise.all([
      prisma.clickEvent.findMany({
        where,
        orderBy: { clickedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          clickedAt: true,
          referrerHost: true,
          source: true,
          deviceType: true,
          os: true,
          browser: true,
          country: true,
          isBot: true,
        },
      }),
      prisma.clickEvent.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        link: {
          id: link.id,
          shortCode: link.shortCode,
          title: link.title,
        },
        events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
