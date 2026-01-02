import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/tags - List all tags for workspace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const tags = await prisma.tag.findMany({
      where: { workspaceId },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { links: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        linksCount: tag._count.links,
        createdAt: tag.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, workspaceId } = body;

    if (!name || !workspaceId) {
      return NextResponse.json({ error: "Name and workspace ID required" }, { status: 400 });
    }

    // Check if tag exists
    const existing = await prisma.tag.findFirst({
      where: { workspaceId, name },
    });

    if (existing) {
      return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
    }

    const tag = await prisma.tag.create({
      data: {
        workspaceId,
        name,
        color: color || "#6366f1",
      },
    });

    return NextResponse.json({
      success: true,
      data: tag,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/tags - Update a tag
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, color } = body;

    if (!id) {
      return NextResponse.json({ error: "Tag ID required" }, { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
      },
    });

    return NextResponse.json({ success: true, data: tag });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/tags - Delete a tag
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Tag ID required" }, { status: 400 });
    }

    await prisma.tag.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Tag deleted" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
