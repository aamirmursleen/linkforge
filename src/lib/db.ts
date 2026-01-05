import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, neonConfig } from "@neondatabase/serverless";

// Enable WebSocket for Neon in serverless environments
neonConfig.webSocketConstructor = typeof WebSocket !== "undefined" ? WebSocket : undefined;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Check for Vercel Postgres, Neon, or standard DATABASE_URL
  const connectionString =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("DATABASE_URL is not set. Please configure your database.");
    // Return a proxy that throws helpful errors
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === "$connect" || prop === "$disconnect") {
          return () => Promise.resolve();
        }
        throw new Error(
          "Database not configured. Please set DATABASE_URL environment variable."
        );
      },
    });
  }

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    throw error;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// Helper to check if database is configured
export function isDatabaseConfigured(): boolean {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL);
}
