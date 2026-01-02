import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/qr/[id] - Get single QR code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const qrCode = await prisma.qRCode.findUnique({
      where: { id },
      include: {
        shortLink: true,
        template: true,
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: "QR code not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: qrCode,
    });
  } catch (error) {
    console.error("Error fetching QR code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/qr/[id] - Update QR code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      foregroundColor,
      backgroundColor,
      dotStyle,
      cornerStyle,
      logo,
      logoSize,
      logoPadding,
      frameStyle,
      frameText,
      frameColor,
      size,
      format,
    } = body;

    const qrCode = await prisma.qRCode.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(foregroundColor !== undefined && { foregroundColor }),
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(dotStyle !== undefined && { dotStyle }),
        ...(cornerStyle !== undefined && { cornerStyle }),
        ...(logo !== undefined && { logo }),
        ...(logoSize !== undefined && { logoSize }),
        ...(logoPadding !== undefined && { logoPadding }),
        ...(frameStyle !== undefined && { frameStyle }),
        ...(frameText !== undefined && { frameText }),
        ...(frameColor !== undefined && { frameColor }),
        ...(size !== undefined && { size }),
        ...(format !== undefined && { format }),
      },
    });

    return NextResponse.json({ success: true, data: qrCode });
  } catch (error) {
    console.error("Error updating QR code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/qr/[id] - Delete QR code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Unlink from any short links first
    await prisma.shortLink.updateMany({
      where: { qrCodeId: id },
      data: { qrCodeId: null },
    });

    await prisma.qRCode.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "QR code deleted" });
  } catch (error) {
    console.error("Error deleting QR code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
