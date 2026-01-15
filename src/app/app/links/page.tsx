"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Sparkles,
  MousePointerClick,
  Globe,
} from "lucide-react";

interface ShortLink {
  id: string;
  title: string;
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  domain: string | null;
  clickCount: number;
  status: string;
  createdAt: string;
  expiresAt?: string;
  password?: string;
}

interface CustomDomain {
  id: string;
  domain: string;
  status: string;
  linksCount: number;
}

// Glowing Icon Component
function GlowingIcon({ icon: Icon, color, size = "md" }: { icon: any; color: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  const containerSizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  const glowSizes = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };

  return (
    <div className={`relative ${containerSizes[size]} flex items-center justify-center`}>
      <div className={`absolute ${glowSizes[size]} rounded-full ${color} opacity-40 blur-lg`} />
      <div className={`relative ${containerSizes[size]} rounded-xl ${color} bg-opacity-20 flex items-center justify-center backdrop-blur-sm border border-white/10`}>
        <Icon className={`${sizes[size]} text-white`} />
      </div>
    </div>
  );
}

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
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
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");
  const [domainsLimit, setDomainsLimit] = useState({ used: 0, total: 2 });

  const appUrl = typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

  // Fetch links and domains from API
  useEffect(() => {
    fetchLinks();
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/domains");
      const data = await res.json();
      if (data.success) {
        // Only show verified domains
        const verifiedDomains = (data.data || []).filter((d: CustomDomain) => d.status === "verified");
        setDomains(verifiedDomains);
        if (data.limits) {
          setDomainsLimit({ used: data.limits.used, total: data.limits.total });
        }
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error);
    }
  };

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
          domainId: selectedDomainId || undefined,
          expiresAt: expiryDate || undefined,
          password: password || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLinks([data.data, ...links]);
        setNewUrl("");
        setCustomAlias("");
        setLinkTitle("");
        setExpiryDate("");
        setPassword("");
        setSelectedDomainId("");
        setShowAdvanced(false);
        setIsCreating(false);
        navigator.clipboard.writeText(data.data.shortUrl);
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
    const url = link.shortUrl || `${appUrl}/r/${link.shortCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Get display URL for a link
  const getDisplayUrl = (link: ShortLink) => {
    if (link.domain) {
      return `${link.domain}/${link.shortCode}`;
    }
    return `${appUrl.replace(/https?:\/\//, "")}/r/${link.shortCode}`;
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

  const totalClicks = links.reduce((acc, l) => acc + (l.clickCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0f0a1f]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader title="Links" />

        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Link2} color="bg-violet-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{links.length}</div>
                  <div className="text-xs text-gray-400">Total Links</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={MousePointerClick} color="bg-emerald-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Total Clicks</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={BarChart3} color="bg-cyan-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
                  </div>
                  <div className="text-xs text-gray-400">Avg. Clicks</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Sparkles} color="bg-amber-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {links.filter(l => l.status === "active").length}
                  </div>
                  <div className="text-xs text-gray-400">Active Links</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search links..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              {isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isCreating ? "Cancel" : "Create Link"}
            </button>
          </div>

          {/* Create Link Card */}
          <div className={`bg-white/5 backdrop-blur-xl rounded-2xl border-2 transition-all ${isCreating ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : "border-white/10 border-dashed"}`}>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-1 w-full space-y-3">
                    <input
                      placeholder="Paste your long URL here..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-base"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !showAdvanced && handleCreateLink()}
                    />

                    <input
                      placeholder="Link title (e.g., My YouTube Video)"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                    />

                    {isCreating && (
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        {showAdvanced ? "Hide" : "Show"} advanced options
                        <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleCreateLink}
                    disabled={!newUrl || isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all"
                  >
                    {isSaving ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Link2 className="h-5 w-5" />
                    )}
                    {isSaving ? "Creating..." : "Shorten"}
                  </button>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    {/* Custom Domain Selection */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-300">
                        <Globe className="h-4 w-4 inline mr-1" />
                        Custom Domain
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        value={selectedDomainId}
                        onChange={(e) => setSelectedDomainId(e.target.value)}
                      >
                        <option value="">Default (LinkForge)</option>
                        {domains.map((domain) => (
                          <option key={domain.id} value={domain.id}>
                            {domain.domain} ({domain.linksCount} links)
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500">
                        {domains.length === 0 ? (
                          <span>No custom domains configured. <a href="/app/domains" className="text-violet-400 hover:underline">Add a domain</a></span>
                        ) : (
                          <span>Using {domainsLimit.used} of {domainsLimit.total} custom domains</span>
                        )}
                      </p>
                    </div>

                    {/* Custom Alias */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-300">Custom Alias</label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 bg-white/10 rounded-l-xl text-sm text-gray-400 border border-white/10 border-r-0">
                          {selectedDomainId
                            ? domains.find(d => d.id === selectedDomainId)?.domain + "/"
                            : appUrl.replace(/https?:\/\//, "") + "/r/"}
                        </span>
                        <input
                          placeholder="your-custom-link"
                          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-r-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Leave empty for auto-generated short code</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Expiry Date (optional)
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        <Lock className="h-4 w-4 inline mr-1" />
                        Password Protection (optional)
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Links List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-400" />
                <p className="text-sm text-gray-400 mt-2">Loading links...</p>
              </div>
            ) : filteredLinks.length > 0 ? (
              filteredLinks.map((link, index) => {
                const colors = ["bg-violet-500", "bg-emerald-500", "bg-cyan-500", "bg-amber-500", "bg-rose-500", "bg-blue-500"];
                const iconColor = colors[index % colors.length];

                return (
                  <div
                    key={link.id}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all group hover:shadow-lg hover:shadow-violet-500/5"
                  >
                    <div className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Link Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <GlowingIcon icon={Link2} color={iconColor} size="lg" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white truncate">
                                {link.title || "Untitled Link"}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                link.status === "active"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}>
                                {link.status}
                              </span>
                              {link.password && (
                                <Lock className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <a
                                href={link.shortUrl || `${appUrl}/r/${link.shortCode}`}
                                className="text-violet-400 font-medium hover:text-violet-300 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {getDisplayUrl(link)}
                              </a>
                              {link.domain && (
                                <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-violet-500/20 text-violet-400">
                                  custom
                                </span>
                              )}
                              <button
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                onClick={() => handleCopy(link)}
                              >
                                {copiedId === link.id ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {link.longUrl}
                            </p>
                          </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center gap-4 lg:gap-6 pl-15 lg:pl-0">
                          <div className="text-center min-w-[60px]">
                            <div className="text-lg font-semibold text-white flex items-center justify-center gap-1">
                              {(link.clickCount || 0).toLocaleString()}
                              {link.clickCount > 0 && <ArrowUpRight className="h-4 w-4 text-emerald-400" />}
                            </div>
                            <div className="text-xs text-gray-400">clicks</div>
                          </div>
                          <div className="text-center min-w-[80px] hidden sm:block">
                            <div className="text-sm text-gray-400">
                              {formatDate(link.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopy(link)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Copy link"
                            >
                              {copiedId === link.id ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View QR Code">
                              <QrCode className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="View Analytics">
                              <BarChart3 className="h-4 w-4 text-gray-400" />
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => setShowDropdown(showDropdown === link.id ? null : link.id)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </button>
                              {showDropdown === link.id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1425] backdrop-blur-xl rounded-xl shadow-xl border border-white/10 py-1 z-10">
                                  <button
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
                                    onClick={() => window.open(link.shortUrl || `${appUrl}/r/${link.shortCode}`, "_blank")}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Open Link
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-2 transition-colors"
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
                    </div>
                  </div>
                );
              })
            ) : searchQuery ? (
              <div className="text-center py-12 text-gray-400">
                No links found matching "{searchQuery}"
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                <div className="relative h-16 w-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-violet-500 rounded-full opacity-20 blur-xl" />
                  <div className="relative h-16 w-16 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-white/10">
                    <Link2 className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">No links yet</h3>
                <p className="text-gray-400 mb-6">Create your first short link to get started!</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Create Link
                </button>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          {links.length > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-white/10">
              <span>{links.length} total links</span>
              <span>{totalClicks.toLocaleString()} total clicks</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
