"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Link2,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Github,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play,
  Music,
  FileText,
  Image as ImageIcon,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Block {
  id: string;
  type: string;
  content: any;
  style?: any;
}

interface PageData {
  id: string;
  title: string;
  description: string | null;
  blocks: Block[];
  theme: string;
  backgroundColor: string;
  backgroundImage: string | null;
}

const THEMES = {
  default: {
    bg: "bg-gradient-to-br from-slate-50 to-slate-100",
    card: "bg-white shadow-sm hover:shadow-md",
    text: "text-slate-900",
    textMuted: "text-slate-600",
    accent: "bg-slate-900 text-white",
  },
  dark: {
    bg: "bg-gradient-to-br from-slate-900 to-slate-800",
    card: "bg-slate-800 hover:bg-slate-700 border border-slate-700",
    text: "text-white",
    textMuted: "text-slate-400",
    accent: "bg-white text-slate-900",
  },
  ocean: {
    bg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    card: "bg-white/90 backdrop-blur shadow-lg hover:bg-white",
    text: "text-slate-900",
    textMuted: "text-slate-600",
    accent: "bg-blue-600 text-white",
  },
  sunset: {
    bg: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    card: "bg-white/90 backdrop-blur shadow-lg hover:bg-white",
    text: "text-slate-900",
    textMuted: "text-slate-600",
    accent: "bg-pink-500 text-white",
  },
  forest: {
    bg: "bg-gradient-to-br from-green-600 to-emerald-800",
    card: "bg-white/90 backdrop-blur shadow-lg hover:bg-white",
    text: "text-slate-900",
    textMuted: "text-slate-600",
    accent: "bg-emerald-600 text-white",
  },
  minimal: {
    bg: "bg-white",
    card: "border-2 border-slate-200 hover:border-slate-400",
    text: "text-slate-900",
    textMuted: "text-slate-600",
    accent: "bg-slate-900 text-white",
  },
};

const SOCIAL_ICONS: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  website: Globe,
  email: Mail,
  phone: Phone,
  location: MapPin,
};

export function BioPageClient({ page }: { page: PageData }) {
  const theme = THEMES[page.theme as keyof typeof THEMES] || THEMES.default;
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case "header":
        return (
          <div className="text-center mb-8">
            {block.content.avatar && (
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white/50 shadow-lg">
                <img
                  src={block.content.avatar}
                  alt={block.content.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className={cn("text-2xl font-bold mb-2", theme.text)}>
              {block.content.title}
            </h1>
            {block.content.subtitle && (
              <p className={cn("text-sm", theme.textMuted)}>
                {block.content.subtitle}
              </p>
            )}
            {block.content.bio && (
              <p className={cn("mt-3 text-sm max-w-md mx-auto", theme.textMuted)}>
                {block.content.bio}
              </p>
            )}
          </div>
        );

      case "link":
        return (
          <a
            href={block.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block w-full p-4 rounded-xl text-center transition-all",
              theme.card
            )}
          >
            <div className="flex items-center justify-center gap-3">
              {block.content.icon && (
                <span className="text-xl">{block.content.icon}</span>
              )}
              <span className={cn("font-medium", theme.text)}>
                {block.content.title}
              </span>
              <ExternalLink className={cn("h-4 w-4 ml-auto", theme.textMuted)} />
            </div>
            {block.content.description && (
              <p className={cn("text-sm mt-1", theme.textMuted)}>
                {block.content.description}
              </p>
            )}
          </a>
        );

      case "social":
        return (
          <div className="flex flex-wrap justify-center gap-3">
            {block.content.links?.map((social: any, index: number) => {
              const Icon = SOCIAL_ICONS[social.platform] || Globe;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "p-3 rounded-full transition-all hover:scale-110",
                    theme.card
                  )}
                  title={social.platform}
                >
                  <Icon className={cn("h-5 w-5", theme.text)} />
                </a>
              );
            })}
          </div>
        );

      case "text":
        return (
          <div
            className={cn(
              "p-4 rounded-xl",
              theme.card
            )}
          >
            {block.content.title && (
              <h3 className={cn("font-semibold mb-2", theme.text)}>
                {block.content.title}
              </h3>
            )}
            <p className={cn("text-sm whitespace-pre-wrap", theme.textMuted)}>
              {block.content.text}
            </p>
          </div>
        );

      case "divider":
        return (
          <div className="flex items-center gap-4 py-2">
            <div className={cn("flex-1 h-px", theme.textMuted, "opacity-30")} />
            {block.content.text && (
              <span className={cn("text-xs", theme.textMuted)}>
                {block.content.text}
              </span>
            )}
            <div className={cn("flex-1 h-px", theme.textMuted, "opacity-30")} />
          </div>
        );

      case "image":
        return (
          <div className={cn("rounded-xl overflow-hidden", theme.card)}>
            <img
              src={block.content.url}
              alt={block.content.alt || "Image"}
              className="w-full h-auto"
            />
            {block.content.caption && (
              <p className={cn("p-3 text-sm text-center", theme.textMuted)}>
                {block.content.caption}
              </p>
            )}
          </div>
        );

      case "video":
        return (
          <div className={cn("rounded-xl overflow-hidden", theme.card)}>
            {block.content.type === "youtube" ? (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${block.content.videoId}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={block.content.url}
                controls
                className="w-full"
                poster={block.content.thumbnail}
              />
            )}
            {block.content.title && (
              <p className={cn("p-3 text-sm font-medium", theme.text)}>
                {block.content.title}
              </p>
            )}
          </div>
        );

      case "accordion":
        const isExpanded = expandedBlocks.has(block.id);
        return (
          <div className={cn("rounded-xl overflow-hidden", theme.card)}>
            <button
              onClick={() => toggleExpand(block.id)}
              className="w-full p-4 flex items-center justify-between"
            >
              <span className={cn("font-medium", theme.text)}>
                {block.content.title}
              </span>
              {isExpanded ? (
                <ChevronUp className={cn("h-5 w-5", theme.textMuted)} />
              ) : (
                <ChevronDown className={cn("h-5 w-5", theme.textMuted)} />
              )}
            </button>
            {isExpanded && (
              <div className={cn("px-4 pb-4 text-sm", theme.textMuted)}>
                {block.content.content}
              </div>
            )}
          </div>
        );

      case "contact":
        return (
          <div className={cn("p-4 rounded-xl space-y-3", theme.card)}>
            {block.content.email && (
              <a
                href={`mailto:${block.content.email}`}
                className="flex items-center gap-3"
              >
                <Mail className={cn("h-5 w-5", theme.textMuted)} />
                <span className={cn("text-sm", theme.text)}>
                  {block.content.email}
                </span>
              </a>
            )}
            {block.content.phone && (
              <a
                href={`tel:${block.content.phone}`}
                className="flex items-center gap-3"
              >
                <Phone className={cn("h-5 w-5", theme.textMuted)} />
                <span className={cn("text-sm", theme.text)}>
                  {block.content.phone}
                </span>
              </a>
            )}
            {block.content.address && (
              <div className="flex items-center gap-3">
                <MapPin className={cn("h-5 w-5", theme.textMuted)} />
                <span className={cn("text-sm", theme.text)}>
                  {block.content.address}
                </span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn("min-h-screen py-12 px-4", theme.bg)}
      style={{
        backgroundColor: page.backgroundColor || undefined,
        backgroundImage: page.backgroundImage
          ? `url(${page.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto space-y-4">
        {page.blocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}

        {/* Powered by footer */}
        <div className="pt-8 text-center">
          <a
            href="/"
            className={cn(
              "inline-flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity",
              theme.textMuted
            )}
          >
            <Link2 className="h-3 w-3" />
            Powered by LinkForge
          </a>
        </div>
      </div>
    </div>
  );
}
