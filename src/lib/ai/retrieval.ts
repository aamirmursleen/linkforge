import { prisma } from "@/lib/db";
import { AI_CONFIG } from "./config";

export interface RetrievedDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  score: number;
  source: string;
}

// Simple keyword-based search (for production, use vector embeddings)
function calculateRelevanceScore(query: string, content: string, title: string): number {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();

  let score = 0;

  for (const term of queryTerms) {
    // Title matches are worth more
    if (titleLower.includes(term)) {
      score += 3;
    }

    // Content matches
    const matches = (contentLower.match(new RegExp(term, 'g')) || []).length;
    score += Math.min(matches, 5); // Cap at 5 matches per term

    // Exact phrase bonus
    if (contentLower.includes(query.toLowerCase())) {
      score += 10;
    }
  }

  // Normalize by query length
  return score / queryTerms.length;
}

// Map categories to friendly source names
function getSourceName(category: string, title: string): string {
  const categoryMap: Record<string, string> = {
    features: "Feature Guide",
    guides: "Getting Started Guide",
    faqs: "FAQ",
    general: "Help Center",
  };

  return categoryMap[category] || "Help Center";
}

export async function retrieveRelevantDocs(
  query: string,
  topK: number = AI_CONFIG.topK
): Promise<RetrievedDocument[]> {
  // Get all documents
  const allDocs = await prisma.kBDocument.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      filePath: true,
    },
  });

  // Score and rank documents
  const scoredDocs = allDocs.map(doc => ({
    id: doc.id,
    title: doc.title,
    content: doc.content,
    category: doc.category || "general",
    score: calculateRelevanceScore(query, doc.content, doc.title),
    source: getSourceName(doc.category || "general", doc.title),
  }));

  // Sort by score and take top K
  const topDocs = scoredDocs
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return topDocs;
}

export function formatContextForPrompt(docs: RetrievedDocument[]): string {
  if (docs.length === 0) {
    return "No relevant documentation found. Please provide general guidance about LinkForge.";
  }

  const context = docs.map((doc, i) => {
    return `[Source: ${doc.source} - ${doc.title}]
${doc.content}`;
  }).join("\n\n---\n\n");

  return `Here is relevant information from the LinkForge documentation:

${context}

Use this information to answer the user's question. If the answer isn't fully covered, acknowledge what you know and suggest contacting support for more details.`;
}

export function extractSourceCitations(docs: RetrievedDocument[]): string[] {
  const uniqueSources = new Map<string, string>();

  for (const doc of docs) {
    const key = `${doc.source} - ${doc.title}`;
    if (!uniqueSources.has(key)) {
      uniqueSources.set(key, doc.source);
    }
  }

  return Array.from(uniqueSources.keys());
}
