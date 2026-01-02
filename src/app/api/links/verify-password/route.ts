import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  verifyPassword,
  checkPasswordAttempts,
  recordPasswordAttempt,
  generatePasswordSessionToken,
} from "@/lib/redirect";

// POST /api/links/verify-password - Verify password for protected link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, password } = body;

    if (!code || !password) {
      return NextResponse.json(
        { error: "Code and password are required" },
        { status: 400 }
      );
    }

    // Find the link
    const link = await prisma.shortLink.findFirst({
      where: { shortCode: code, domainId: null },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (!link.password) {
      return NextResponse.json(
        { error: "This link is not password protected" },
        { status: 400 }
      );
    }

    // Check rate limiting
    const attemptCheck = checkPasswordAttempts(link.id);
    if (!attemptCheck.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait 15 minutes and try again." },
        { status: 429 }
      );
    }

    // Verify password
    const isValid = verifyPassword(password, link.password);

    // Record attempt
    recordPasswordAttempt(link.id, isValid);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Incorrect password",
          remainingAttempts: attemptCheck.remainingAttempts - 1,
        },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generatePasswordSessionToken(link.id);

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Password verified",
    });

    // Set cookie for 1 hour
    response.cookies.set(`lf_pw_${link.id}`, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
