import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        blocks: JSON.parse(page.blocks),
      },
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/pages/[id] - Update page
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      slug,
      blocks,
      theme,
      customCss,
      backgroundImage,
      backgroundColor,
      metaTitle,
      metaDescription,
      ogImage,
      status,
    } = body;

    // Check if new slug conflicts
    if (slug) {
      const existing = await prisma.page.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A page with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (slug !== undefined) updateData.slug = slug;
    if (blocks !== undefined) updateData.blocks = JSON.stringify(blocks);
    if (theme !== undefined) updateData.theme = theme;
    if (customCss !== undefined) updateData.customCss = customCss;
    if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage;
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (ogImage !== undefined) updateData.ogImage = ogImage;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "published") {
        updateData.publishedAt = new Date();
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        blocks: JSON.parse(page.blocks),
      },
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/pages/[id] - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.page.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Page deleted" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
