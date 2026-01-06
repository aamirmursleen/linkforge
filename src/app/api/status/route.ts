import { NextResponse } from "next/server";
import prisma, { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const urlConfigured = isDatabaseConfigured();
  let dbConnected = false;
  let dbError: string | null = null;

  // Only test connection if URL is configured
  if (urlConfigured) {
    try {
      // Try a simple query to verify connection and tables exist
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (error: any) {
      dbError = error.message || "Failed to connect to database";
      // Check for common errors
      if (error.message?.includes("does not exist")) {
        dbError = "Database tables not created. Run 'npx prisma db push' to create them.";
      } else if (error.message?.includes("connection")) {
        dbError = "Cannot connect to database. Check your DATABASE_URL.";
      }
    }
  }

  const needsSetup = !urlConfigured || !dbConnected;

  return NextResponse.json({
    status: needsSetup ? "setup_required" : "ok",
    database: dbConnected,
    urlConfigured,
    message: dbConnected
      ? "All systems operational"
      : urlConfigured
        ? `Database connection failed: ${dbError}`
        : "Database not configured. Please add a PostgreSQL database.",
    setup: needsSetup
      ? {
          steps: urlConfigured
            ? [
                "Database URL is set but connection failed",
                "Make sure your PostgreSQL database is running",
                "Run 'npx prisma db push' to create tables",
                "Redeploy your project",
              ]
            : [
                "Go to Vercel Dashboard → Your Project",
                "Click 'Storage' tab",
                "Click 'Create Database' → Select 'Postgres'",
                "Follow the setup wizard",
                "Vercel will automatically add DATABASE_URL",
                "Run 'npx prisma db push' to create tables",
                "Redeploy your project",
              ],
          alternative: "Or use Neon.tech (free) and add DATABASE_URL manually",
        }
      : null,
  });
}
