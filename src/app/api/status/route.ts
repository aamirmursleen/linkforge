import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbConfigured = isDatabaseConfigured();

  return NextResponse.json({
    status: dbConfigured ? "ok" : "setup_required",
    database: dbConfigured,
    message: dbConfigured
      ? "All systems operational"
      : "Database not configured. Please add a PostgreSQL database.",
    setup: !dbConfigured
      ? {
          steps: [
            "Go to Vercel Dashboard → Your Project",
            "Click 'Storage' tab",
            "Click 'Create Database' → Select 'Postgres'",
            "Follow the setup wizard",
            "Vercel will automatically add DATABASE_URL",
            "Redeploy your project",
          ],
          alternative: "Or use Neon.tech (free) and add DATABASE_URL manually",
        }
      : null,
  });
}
