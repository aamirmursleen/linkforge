"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  Plus,
  Search,
  Copy,
  ExternalLink,
  MoreHorizontal,
  ArrowUpRight,
  Check,
  Trash2,
  QrCode,
  BarChart3,
  Calendar,
  Lock,
  ChevronDown,
  X,
  Settings,
  Loader2,
} from "lucide-react";

interface ShortLink {
  id: string;
  title: string;
  shortCode: string;
  longUrl: string;
  clickCount: number;
  status: string;
  createdAt: string;
  expiresAt?: string;
  password?: string;
}

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export default function LinksPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customAlias, setCustomAlias] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [password, setPassword] = useState("");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const appUrl = typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

  // Fetch links from API
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/links");
      const data = await res.json();
      if (data.success) {
        setLinks(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new link
  const handleCreateLink = async () => {
    if (!newUrl || isSaving) return;

    // Validate URL
    let url = newUrl;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url);
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longUrl: url,
          title: linkTitle || undefined,
          customCode: customAlias || undefined,
          expiresAt: expiryDate || undefined,
          password: password || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Add new link to list
        setLinks([data.data, ...links]);

        // Reset form
        setNewUrl("");
        setCustomAlias("");
        setLinkTitle("");
        setExpiryDate("");
        setPassword("");
        setShowAdvanced(false);
        setIsCreating(false);

        // Copy to clipboard
        navigator.clipboard.writeText(`${appUrl}/r/${data.data.shortCode}`);
        setCopiedId(data.data.id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        alert(data.error || "Failed to create link");
      }
    } catch (error) {
      console.error("Failed to create link:", error);
      alert("Failed to create link. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Copy link to clipboard
  const handleCopy = (link: ShortLink) => {
    navigator.clipboard.writeText(`${appUrl}/r/${link.shortCode}`);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete link
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setLinks(links.filter(l => l.id !== id));
      } else {
        alert(data.error || "Failed to delete link");
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
    setShowDropdown(null);
  };

  // Filter links by search
  const filteredLinks = links.filter(link =>
    (link.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.longUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AppHeader title="Links" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <Input
              placeholder="Search links..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {isCreating ? "Cancel" : "Create Link"}
          </Button>
        </div>

        {/* Create Link Card */}
        <Card className={`border-2 transition-all ${isCreating ? "border-[var(--primary)] bg-[var(--primary-pale)]/30" : "border-dashed"}`}>
          <CardContent className="py-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1 w-full space-y-3">
                  <Input
                    placeholder="Paste your long URL here..."
                    className="h-12 text-base"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !showAdvanced && handleCreateLink()}
                  />

                  {/* Link Title - Always Visible */}
                  <Input
                    placeholder="Link title (e.g., My YouTube Video)"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                  />

                  {isCreating && (
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
                    >
                      <Settings className="h-4 w-4" />
                      {showAdvanced ? "Hide" : "Show"} advanced options
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                <Button size="lg" onClick={handleCreateLink} disabled={!newUrl || isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Link2 className="h-5 w-5 mr-2" />
                  )}
                  {isSaving ? "Creating..." : "Shorten"}
                </Button>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-[var(--dark)]">Custom Alias</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-[var(--border)] rounded-l-md text-sm text-[var(--muted)]">
                        {appUrl.replace(/https?:\/\//, "")}/r/
                      </span>
                      <Input
                        placeholder="your-custom-link"
                        className="rounded-l-none"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      />
                    </div>
                    <p className="text-xs text-[var(--muted)]">Leave empty for auto-generated short code</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--dark)]">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Expiry Date (optional)
                    </label>
                    <Input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--dark)]">
                      <Lock className="h-4 w-4 inline mr-1" />
                      Password Protection (optional)
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Links List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[var(--primary)]" />
              <p className="text-sm text-[var(--muted)] mt-2">Loading links...</p>
            </div>
          ) : filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
              <Card key={link.id} className="hover:shadow-md transition-shadow group">
                <CardContent className="py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Link Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center shrink-0">
                        <Link2 className="h-6 w-6 text-[var(--primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[var(--dark)] truncate">
                            {link.title || "Untitled Link"}
                          </h3>
                          <Badge
                            variant={link.status === "active" ? "success" : "destructive"}
                            className="shrink-0"
                          >
                            {link.status}
                          </Badge>
                          {link.password && (
                            <Lock className="h-3 w-3 text-[var(--muted)]" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <a
                            href={`${appUrl}/r/${link.shortCode}`}
                            className="text-[var(--primary)] font-medium hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {appUrl.replace(/https?:\/\//, "")}/r/{link.shortCode}
                          </a>
                          <button
                            className="p-1 hover:bg-[var(--border)] rounded transition-colors"
                            onClick={() => handleCopy(link)}
                          >
                            {copiedId === link.id ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3 text-[var(--muted)]" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-[var(--muted)] truncate mt-1">
                          {link.longUrl}
                        </p>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-4 lg:gap-6 pl-15 lg:pl-0">
                      <div className="text-center min-w-[60px]">
                        <div className="text-lg font-semibold text-[var(--dark)] flex items-center justify-center gap-1">
                          {(link.clickCount || 0).toLocaleString()}
                          {link.clickCount > 0 && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                        </div>
                        <div className="text-xs text-[var(--muted)]">clicks</div>
                      </div>
                      <div className="text-center min-w-[80px] hidden sm:block">
                        <div className="text-sm text-[var(--muted)]">
                          {formatDate(link.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(link)}
                          title="Copy link"
                        >
                          {copiedId === link.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" title="View QR Code">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="View Analytics">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDropdown(showDropdown === link.id ? null : link.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          {showDropdown === link.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--border)] flex items-center gap-2"
                                onClick={() => window.open(`${appUrl}/r/${link.shortCode}`, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4" />
                                Open Link
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--border)] flex items-center gap-2 text-red-600"
                                onClick={() => handleDelete(link.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Link
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : searchQuery ? (
            <div className="text-center py-12 text-[var(--muted)]">
              No links found matching "{searchQuery}"
            </div>
          ) : (
            <EmptyState
              icon={Link2}
              title="No links yet"
              description="Create your first short link to get started. Just paste a URL above!"
              actionLabel="Create Link"
              onAction={() => setIsCreating(true)}
            />
          )}
        </div>

        {/* Stats Summary */}
        {links.length > 0 && (
          <div className="flex items-center justify-between text-sm text-[var(--muted)] pt-4 border-t">
            <span>{links.length} total links</span>
            <span>{links.reduce((acc, l) => acc + (l.clickCount || 0), 0).toLocaleString()} total clicks</span>
          </div>
        )}
      </div>
    </>
  );
}
