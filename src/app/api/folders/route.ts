import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/folders - List all folders for workspace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const parentId = searchParams.get("parentId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const where: any = { workspaceId };
    if (parentId === "null" || parentId === "") {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    const folders = await prisma.folder.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { shortLinks: true, children: true } },
        children: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: folders.map((folder) => ({
        id: folder.id,
        name: folder.name,
        description: folder.description,
        color: folder.color,
        icon: folder.icon,
        parentId: folder.parentId,
        linksCount: folder._count.shortLinks,
        childrenCount: folder._count.children,
        children: folder.children,
        createdAt: folder.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/folders - Create a new folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, icon, parentId, workspaceId } = body;

    if (!name || !workspaceId) {
      return NextResponse.json({ error: "Name and workspace ID required" }, { status: 400 });
    }

    // Check if folder with same name exists in same parent
    const existing = await prisma.folder.findFirst({
      where: { workspaceId, name, parentId: parentId || null },
    });

    if (existing) {
      return NextResponse.json({ error: "Folder already exists" }, { status: 409 });
    }

    // Validate parent exists if provided
    if (parentId) {
      const parent = await prisma.folder.findUnique({ where: { id: parentId } });
      if (!parent || parent.workspaceId !== workspaceId) {
        return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
      }
    }

    const folder = await prisma.folder.create({
      data: {
        workspaceId,
        name,
        description: description || null,
        color: color || null,
        icon: icon || null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ success: true, data: folder }, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/folders - Update a folder
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, color, icon, parentId } = body;

    if (!id) {
      return NextResponse.json({ error: "Folder ID required" }, { status: 400 });
    }

    // Prevent setting parent to self or descendant
    if (parentId === id) {
      return NextResponse.json({ error: "Folder cannot be its own parent" }, { status: 400 });
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        ...(parentId !== undefined && { parentId: parentId || null }),
      },
    });

    return NextResponse.json({ success: true, data: folder });
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/folders - Delete a folder
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const moveLinksTo = searchParams.get("moveLinksTo"); // Optional: move links to another folder

    if (!id) {
      return NextResponse.json({ error: "Folder ID required" }, { status: 400 });
    }

    const folder = await prisma.folder.findUnique({
      where: { id },
      include: { _count: { select: { shortLinks: true } } },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Move links if target specified
    if (folder._count.shortLinks > 0) {
      await prisma.shortLink.updateMany({
        where: { folderId: id },
        data: { folderId: moveLinksTo || null },
      });
    }

    // Move child folders to parent
    await prisma.folder.updateMany({
      where: { parentId: id },
      data: { parentId: folder.parentId },
    });

    await prisma.folder.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Folder deleted" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
