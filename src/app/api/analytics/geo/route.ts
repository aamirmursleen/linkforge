import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getDateRange } from "@/lib/analytics";

// GET /api/analytics/geo - Get geographic analytics (country/city level)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";
    const level = searchParams.get("level") || "country"; // country, city
    const country = searchParams.get("country"); // Filter by specific country for city drill-down

    const { start, end } = getDateRange(range);

    const where: any = {
      clickedAt: { gte: start, lte: end },
      isBot: false,
    };

    if (country) {
      where.country = country;
    }

    const clickEvents = await prisma.clickEvent.findMany({
      where,
      select: {
        country: true,
        region: true,
        city: true,
        ipHash: true,
        clickedAt: true,
      },
    });

    const totalClicks = clickEvents.length;

    if (level === "city") {
      // City-level breakdown
      const cityBreakdown: Record<
        string,
        { clicks: number; uniqueIps: Set<string>; region: string; country: string }
      > = {};

      clickEvents.forEach((event) => {
        const city = event.city || "Unknown";
        const key = `${city}-${event.region || ""}-${event.country || ""}`;

        if (!cityBreakdown[key]) {
          cityBreakdown[key] = {
            clicks: 0,
            uniqueIps: new Set(),
            region: event.region || "Unknown",
            country: event.country || "Unknown",
          };
        }
        cityBreakdown[key].clicks++;
        if (event.ipHash) {
          cityBreakdown[key].uniqueIps.add(event.ipHash);
        }
      });

      const cities = Object.entries(cityBreakdown)
        .map(([key, stats]) => {
          const city = key.split("-")[0];
          return {
            city,
            region: stats.region,
            country: stats.country,
            clicks: stats.clicks,
            uniqueVisitors: stats.uniqueIps.size,
            percentage: totalClicks > 0 ? Math.round((stats.clicks / totalClicks) * 100) : 0,
          };
        })
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 20);

      return NextResponse.json({
        success: true,
        data: {
          level: "city",
          dateRange: { start: start.toISOString(), end: end.toISOString(), range },
          totalClicks,
          locations: cities,
        },
      });
    }

    // Country-level breakdown (default)
    const countryBreakdown: Record<
      string,
      { clicks: number; uniqueIps: Set<string>; cities: Set<string> }
    > = {};

    clickEvents.forEach((event) => {
      const country = event.country || "Unknown";

      if (!countryBreakdown[country]) {
        countryBreakdown[country] = { clicks: 0, uniqueIps: new Set(), cities: new Set() };
      }
      countryBreakdown[country].clicks++;
      if (event.ipHash) {
        countryBreakdown[country].uniqueIps.add(event.ipHash);
      }
      if (event.city) {
        countryBreakdown[country].cities.add(event.city);
      }
    });

    const countries = Object.entries(countryBreakdown)
      .map(([country, stats]) => ({
        country,
        clicks: stats.clicks,
        uniqueVisitors: stats.uniqueIps.size,
        citiesCount: stats.cities.size,
        percentage: totalClicks > 0 ? Math.round((stats.clicks / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 15);

    // Clicks by day per top 5 countries
    const top5Countries = countries.slice(0, 5).map((c) => c.country);
    const countryTimeline: Record<string, Record<string, number>> = {};

    clickEvents.forEach((event) => {
      const day = event.clickedAt.toISOString().split("T")[0];
      const country = event.country || "Unknown";

      if (top5Countries.includes(country)) {
        if (!countryTimeline[day]) {
          countryTimeline[day] = {};
        }
        countryTimeline[day][country] = (countryTimeline[day][country] || 0) + 1;
      }
    });

    const timeline = Object.entries(countryTimeline)
      .map(([date, countries]) => ({
        date,
        ...countries,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      success: true,
      data: {
        level: "country",
        dateRange: { start: start.toISOString(), end: end.toISOString(), range },
        totalClicks,
        locations: countries,
        timeline,
        topCountries: top5Countries,
      },
    });
  } catch (error) {
    console.error("Error fetching geo analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
