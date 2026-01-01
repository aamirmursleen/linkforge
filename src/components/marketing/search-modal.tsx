"use client";

import * as React from "react";
import Link from "next/link";
import {
  Link2,
  QrCode,
  BarChart3,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickLinks = [
  {
    title: "Create a short link",
    href: "/app/links",
    icon: Link2,
    description: "Shorten any URL in seconds",
  },
  {
    title: "Generate QR code",
    href: "/app/qr",
    icon: QrCode,
    description: "Create scannable QR codes",
  },
  {
    title: "View analytics",
    href: "/app/analytics",
    icon: BarChart3,
    description: "Track your link performance",
  },
  {
    title: "Build a page",
    href: "/products/pages",
    icon: FileText,
    description: "Create a landing page",
  },
];

const popularSearches = [
  "How to create branded links",
  "QR code best practices",
  "API documentation",
  "Pricing plans",
  "Team collaboration",
];

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = React.useState("");
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setFocusedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < quickLinks.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      onOpenChange(false);
    }
  };

  const filteredLinks = query
    ? quickLinks.filter(
        (link) =>
          link.title.toLowerCase().includes(query.toLowerCase()) ||
          link.description.toLowerCase().includes(query.toLowerCase())
      )
    : quickLinks;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex items-center border-b border-[var(--border)] px-4">
          <Search className="h-5 w-5 text-[var(--muted)] shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Search documentation, features, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 text-base h-14"
          />
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-[var(--border)] bg-[var(--primary-pale)] px-2 text-xs text-[var(--muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4">
          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {filteredLinks.map((link, index) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-3 transition-colors",
                    focusedIndex === index
                      ? "bg-[var(--primary-pale)]"
                      : "hover:bg-[var(--border)]"
                  )}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-pale)]">
                    <link.icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {link.title}
                    </p>
                    <p className="text-xs text-[var(--muted)] truncate">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          {!query && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--primary-pale)] transition-colors"
                  >
                    <Sparkles className="h-3 w-3 text-[var(--primary)]" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--primary-pale)]/30">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5">
                  ↑
                </kbd>
                <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5">
                  ↓
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5">
                  ↵
                </kbd>
                to select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5">
                ⌘
              </kbd>
              <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5">
                K
              </kbd>
              to open
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
