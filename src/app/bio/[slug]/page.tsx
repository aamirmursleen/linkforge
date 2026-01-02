import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BioPageClient } from "./client";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const page = await prisma.page.findFirst({
    where: { slug, status: "published" },
  });

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.description || `${page.title} - Bio Link`,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.description || undefined,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}

export default async function BioPage({ params }: Props) {
  const { slug } = await params;

  const page = await prisma.page.findFirst({
    where: { slug, status: "published" },
  });

  if (!page) {
    notFound();
  }

  // Increment view count
  await prisma.page.update({
    where: { id: page.id },
    data: { viewCount: { increment: 1 } },
  });

  const blocks = JSON.parse(page.blocks);

  return (
    <BioPageClient
      page={{
        ...page,
        blocks,
      }}
    />
  );
}
