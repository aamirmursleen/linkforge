import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, rating, text } = body;

    if (!messageId) {
      return Response.json({ error: "Message ID is required" }, { status: 400 });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const message = await prisma.aIChatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    await prisma.aIChatMessage.update({
      where: { id: messageId },
      data: {
        feedbackRating: rating,
        feedbackText: text?.slice(0, 1000),
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return Response.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
