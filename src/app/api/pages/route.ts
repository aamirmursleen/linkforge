import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/pages - List all pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const where: any = { workspaceId };
    if (type) where.type = type;
    if (status) where.status = status;

    const pages = await prisma.page.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: pages.map((page) => ({
        ...page,
        blocks: JSON.parse(page.blocks),
      })),
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      slug,
      title,
      description,
      type = "bio",
      blocks = [],
      theme = "default",
      backgroundColor = "#FFFFFF",
      status = "draft",
    } = body;

    if (!workspaceId || !slug || !title) {
      return NextResponse.json(
        { error: "Workspace ID, slug, and title are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists in workspace
    const existing = await prisma.page.findUnique({
      where: { workspaceId_slug: { workspaceId, slug } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A page with this slug already exists" },
        { status: 409 }
      );
    }

    const page = await prisma.page.create({
      data: {
        workspaceId,
        slug,
        title,
        description: description || null,
        type,
        blocks: JSON.stringify(blocks),
        theme,
        backgroundColor,
        status,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        blocks: JSON.parse(page.blocks),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
