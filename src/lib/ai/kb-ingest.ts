import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Initialize Prisma with pg adapter for scripts
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ChunkMetadata {
  filePath: string;
  title: string;
  category: string;
  section?: string;
  headings: string[];
}

function extractTitle(content: string, filePath: string): string {
  // Try to extract title from first H1
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();

  // Fall back to filename
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function extractCategory(filePath: string): string {
  const parts = filePath.split(path.sep);
  const kbIndex = parts.findIndex((p) => p === "ai-kb" || p === "content");
  if (kbIndex >= 0 && parts[kbIndex + 1]) {
    return parts[kbIndex + 1];
  }
  return "general";
}

function chunkContent(
  content: string,
  chunkSize: number = 800,
  overlap: number = 100
): string[] {
  // Split by paragraphs and headers
  const sections = content.split(/\n(?=#{1,3}\s)/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const section of sections) {
    const paragraphs = section.split(/\n\n+/);

    for (const para of paragraphs) {
      const trimmedPara = para.trim();
      if (!trimmedPara) continue;

      // Rough token estimate (words * 1.3)
      const estimatedTokens = (currentChunk + trimmedPara).split(/\s+/).length * 1.3;

      if (estimatedTokens > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        // Keep overlap from previous chunk
        const words = currentChunk.split(/\s+/);
        const overlapWords = words.slice(-Math.floor(overlap / 1.3));
        currentChunk = overlapWords.join(" ") + "\n\n" + trimmedPara;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + trimmedPara;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

function hashContent(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
}

async function ingestFile(filePath: string): Promise<number> {
  const content = fs.readFileSync(filePath, "utf-8");
  const contentHash = hashContent(content);

  // Check if already ingested with same hash
  const existing = await prisma.kBDocument.findUnique({
    where: { filePath },
  });

  if (existing && existing.contentHash === contentHash) {
    console.log(`  Skipping (unchanged): ${filePath}`);
    return 0;
  }

  // Delete existing chunks for this file
  if (existing) {
    await prisma.kBDocument.deleteMany({
      where: {
        filePath: {
          startsWith: filePath.replace(/\.md$/, ""),
        },
      },
    });
  }

  const title = extractTitle(content, filePath);
  const category = extractCategory(filePath);
  const chunks = chunkContent(content);

  // Insert chunks
  for (let i = 0; i < chunks.length; i++) {
    const chunkPath = chunks.length > 1 ? `${filePath}#chunk${i}` : filePath;

    await prisma.kBDocument.create({
      data: {
        filePath: chunkPath,
        title,
        content: chunks[i],
        contentHash,
        category,
        chunkIndex: i,
        totalChunks: chunks.length,
        metadata: JSON.stringify({
          originalPath: filePath,
          wordCount: chunks[i].split(/\s+/).length,
        }),
      },
    });
  }

  console.log(`  Ingested: ${filePath} (${chunks.length} chunks)`);
  return chunks.length;
}

async function ingestDirectory(dirPath: string): Promise<number> {
  let totalChunks = 0;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      totalChunks += await ingestDirectory(fullPath);
    } else if (entry.name.endsWith(".md")) {
      totalChunks += await ingestFile(fullPath);
    }
  }

  return totalChunks;
}

export async function ingestKnowledgeBase(): Promise<void> {
  console.log("Starting knowledge base ingestion...\n");

  const kbPaths = [
    path.join(process.cwd(), "ai-kb"),
    path.join(process.cwd(), "content"),
  ];

  let totalChunks = 0;

  for (const kbPath of kbPaths) {
    if (fs.existsSync(kbPath)) {
      console.log(`Processing: ${kbPath}`);
      totalChunks += await ingestDirectory(kbPath);
    }
  }

  const docCount = await prisma.kBDocument.count();

  console.log(`\nIngestion complete!`);
  console.log(`Total documents: ${docCount}`);
  console.log(`Total chunks: ${totalChunks}`);
}

export async function rebuildKnowledgeBase(): Promise<void> {
  console.log("Rebuilding knowledge base (deleting all existing docs)...\n");

  await prisma.kBDocument.deleteMany();

  await ingestKnowledgeBase();
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const rebuild = args.includes("--rebuild");

  (rebuild ? rebuildKnowledgeBase() : ingestKnowledgeBase())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Ingestion failed:", err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
