import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("DATABASE_URL is not set. Please configure your database.");
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
    // Close existing pool if reconnecting
    if (globalForPrisma.pool) {
      globalForPrisma.pool.end().catch(() => {});
    }

    const pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on("error", (err) => {
      console.error("Database pool error:", err.message);
    });

    globalForPrisma.pool = pool;
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

export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

/**
 * Check if an error is a database connection/tenant error
 * that should show a helpful message to the user.
 */
export function isDbConnectionError(error: any): boolean {
  const msg = (error?.message || "").toLowerCase();
  const causeMsg = (error?.cause?.message || "").toLowerCase();
  return (
    msg.includes("tenant or user not found") ||
    msg.includes("database not configured") ||
    msg.includes("database_url") ||
    msg.includes("econnrefused") ||
    msg.includes("enotfound") ||
    msg.includes("connection refused") ||
    msg.includes("connection terminated") ||
    msg.includes("connection timeout") ||
    msg.includes("too many clients") ||
    causeMsg.includes("tenant or user not found") ||
    causeMsg.includes("connection refused") ||
    causeMsg.includes("connection terminated") ||
    error?.code === "ECONNREFUSED" ||
    error?.code === "ENOTFOUND" ||
    error?.code === "ETIMEDOUT"
  );
}

/**
 * Get a user-friendly error message for database errors.
 */
export function getDbErrorMessage(error: any): string {
  const msg = (error?.message || "").toLowerCase();
  const causeMsg = (error?.cause?.message || "").toLowerCase();

  if (msg.includes("tenant or user not found") || causeMsg.includes("tenant or user not found")) {
    return "Database connection failed: your Supabase/Neon project may be paused or credentials are invalid. Please check your database dashboard.";
  }
  if (msg.includes("database not configured") || msg.includes("database_url")) {
    return "Database not configured. Please set DATABASE_URL in your .env file.";
  }
  if (msg.includes("too many clients")) {
    return "Database connection pool exhausted. Please try again in a moment.";
  }
  if (error?.code === "ECONNREFUSED" || msg.includes("connection refused") || causeMsg.includes("connection refused")) {
    return "Cannot connect to database. Please check your DATABASE_URL.";
  }
  if (error?.code === "ETIMEDOUT" || msg.includes("connection timeout") || causeMsg.includes("connection timeout")) {
    return "Database connection timed out. Please try again.";
  }
  return "Database connection error. Please check your database configuration.";
}
