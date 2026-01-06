import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetForProduction() {
  console.log("🧹 Resetting database for production...\n");

  // Clear all user data
  console.log("Clearing click events...");
  await prisma.clickEvent.deleteMany();

  console.log("Clearing short links...");
  await prisma.shortLink.deleteMany();

  console.log("Clearing QR codes...");
  await prisma.qRCode.deleteMany();

  console.log("Clearing pages...");
  await prisma.page.deleteMany();

  console.log("Clearing folders...");
  await prisma.folder.deleteMany();

  console.log("Clearing tags...");
  await prisma.tag.deleteMany();

  console.log("Clearing domains...");
  await prisma.domain.deleteMany();

  console.log("Clearing UTM presets...");
  await prisma.utmPreset.deleteMany();

  console.log("Clearing activity logs...");
  await prisma.activityLog.deleteMany();

  console.log("Clearing API keys...");
  await prisma.apiKey.deleteMany();

  console.log("Clearing bulk import jobs...");
  await prisma.bulkImportJob.deleteMany();

  console.log("Clearing workspace members...");
  await prisma.workspaceMember.deleteMany();

  console.log("Clearing workspaces...");
  await prisma.workspace.deleteMany();

  console.log("Clearing users...");
  await prisma.user.deleteMany();

  // Clear AI data
  console.log("Clearing AI chat messages...");
  await prisma.aIChatMessage.deleteMany();

  console.log("Clearing AI chat sessions...");
  await prisma.aIChatSession.deleteMany();

  console.log("Clearing AI tool logs...");
  await prisma.aIToolLog.deleteMany();

  console.log("Clearing AI FAQ cache...");
  await prisma.aIFaqCache.deleteMany();

  // Keep KB documents (they're needed for AI)
  console.log("\n✅ Database reset complete!");
  console.log("📚 Knowledge base documents preserved for AI agent.");
  console.log("\n🚀 App is ready for new users!");
}

resetForProduction()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
