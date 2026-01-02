import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isValidUrl } from "@/lib/analytics";

// GET /api/links/[id] - Get single link details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const link = await prisma.shortLink.findUnique({
      where: { id },
      include: {
        _count: {
          select: { clickEvents: true },
        },
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      success: true,
      data: {
        id: link.id,
        shortCode: link.shortCode,
        shortUrl: `${baseUrl}/r/${link.shortCode}`,
        longUrl: link.longUrl,
        title: link.title,
        description: link.description,
        disabled: link.disabled,
        expiresAt: link.expiresAt,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        clickCount: link._count.clickEvents,
      },
    });

  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/links/[id] - Update link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, longUrl, disabled, expiresAt } = body;

    // Check if link exists
    const existingLink = await prisma.shortLink.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Validate URL if provided
    if (longUrl && !isValidUrl(longUrl)) {
      return NextResponse.json(
        { error: "Invalid URL. Only http and https URLs are allowed." },
        { status: 400 }
      );
    }

    // Parse expiration date if provided
    let expiresAtDate: Date | null | undefined = undefined;
    if (expiresAt !== undefined) {
      if (expiresAt === null) {
        expiresAtDate = null;
      } else {
        expiresAtDate = new Date(expiresAt);
        if (isNaN(expiresAtDate.getTime())) {
          return NextResponse.json(
            { error: "Invalid expiration date format." },
            { status: 400 }
          );
        }
      }
    }

    // Update the link
    const updatedLink = await prisma.shortLink.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(longUrl !== undefined && { longUrl }),
        ...(disabled !== undefined && { disabled }),
        ...(expiresAtDate !== undefined && { expiresAt: expiresAtDate }),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      success: true,
      data: {
        id: updatedLink.id,
        shortCode: updatedLink.shortCode,
        shortUrl: `${baseUrl}/r/${updatedLink.shortCode}`,
        longUrl: updatedLink.longUrl,
        title: updatedLink.title,
        disabled: updatedLink.disabled,
        expiresAt: updatedLink.expiresAt,
        updatedAt: updatedLink.updatedAt,
      },
    });

  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/links/[id] - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if link exists
    const existingLink = await prisma.shortLink.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Delete the link (cascade will delete click events)
    await prisma.shortLink.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Link deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
