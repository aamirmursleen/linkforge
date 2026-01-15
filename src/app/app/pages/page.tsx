"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Lock,
  LayoutTemplate,
  Smartphone,
  Link2,
  User,
  Image,
  Type,
  ListOrdered,
  Contact,
  Minus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  X,
  Palette,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

// Block types
const BLOCK_TYPES = [
  { type: "header", label: "Header", icon: User, description: "Profile header with avatar", color: "bg-violet-500" },
  { type: "link", label: "Link", icon: Link2, description: "Clickable button link", color: "bg-emerald-500" },
  { type: "social", label: "Social Icons", icon: Globe, description: "Social media icons", color: "bg-cyan-500" },
  { type: "text", label: "Text", icon: Type, description: "Text paragraph", color: "bg-amber-500" },
  { type: "divider", label: "Divider", icon: Minus, description: "Section divider", color: "bg-rose-500" },
  { type: "image", label: "Image", icon: Image, description: "Image block", color: "bg-blue-500" },
  { type: "contact", label: "Contact", icon: Contact, description: "Contact information", color: "bg-fuchsia-500" },
];

const THEMES = [
  { id: "default", name: "Light", bg: "#f8fafc" },
  { id: "dark", name: "Dark", bg: "#1e293b" },
  { id: "ocean", name: "Ocean", bg: "#0891b2" },
  { id: "sunset", name: "Sunset", bg: "#f97316" },
  { id: "forest", name: "Forest", bg: "#16a34a" },
  { id: "minimal", name: "Minimal", bg: "#ffffff" },
];

interface Block {
  id: string;
  type: string;
  content: any;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  theme: string;
  blocks: Block[];
  viewCount: number;
  createdAt: string;
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    description: "",
    type: "bio",
    theme: "default",
  });
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Fetch pages on mount
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pages");
      const data = await res.json();
      if (data.success) {
        setPages(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = pages.reduce((acc, p) => acc + p.viewCount, 0);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/bio/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: newPage.slug.toLowerCase().replace(/\s+/g, "-"),
          title: newPage.title,
          description: newPage.description || null,
          type: newPage.type,
          theme: newPage.theme,
          blocks: [],
          status: "draft",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPages([data.data, ...pages]);
        setShowCreateDialog(false);
        setNewPage({ title: "", slug: "", description: "", type: "bio", theme: "default" });
        setEditingPage(data.data);
        setBlocks(data.data.blocks || []);
        setShowEditDialog(true);
      } else {
        alert(data.error || "Failed to create page");
      }
    } catch (error) {
      alert("Failed to create page");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setBlocks([...page.blocks]);
    setShowEditDialog(true);
  };

  const handleSaveBlocks = async () => {
    if (!editingPage) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${editingPage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks }),
      });
      const data = await res.json();
      if (data.success) {
        setPages(pages.map((p) => p.id === editingPage.id ? { ...p, blocks } : p));
        setShowEditDialog(false);
        setEditingPage(null);
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (error) {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "header":
        return { title: "", subtitle: "", bio: "", avatar: "" };
      case "link":
        return { title: "", url: "", icon: "link" };
      case "social":
        return { links: [] };
      case "text":
        return { title: "", text: "" };
      case "divider":
        return { text: "" };
      case "image":
        return { url: "", alt: "", caption: "" };
      case "contact":
        return { email: "", phone: "", address: "" };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    )
      return;

    const newBlocks = [...blocks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPages(pages.filter((p) => p.id !== id));
      }
    } catch (error) {
      alert("Failed to delete page");
    }
  };

  const togglePublish = async (id: string) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    const newStatus = page.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPages(pages.map((p) => p.id === id ? { ...p, status: newStatus } : p));
      }
    } catch (error) {
      alert("Failed to update page");
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50";
  const labelClass = "text-sm font-medium text-gray-300";

  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case "header":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Name / Title</label>
              <input
                value={block.content.title}
                onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                placeholder="Your name"
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input
                value={block.content.subtitle}
                onChange={(e) => updateBlock(block.id, { ...block.content, subtitle: e.target.value })}
                placeholder="Developer, Creator, etc."
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                value={block.content.bio}
                onChange={(e) => updateBlock(block.id, { ...block.content, bio: e.target.value })}
                placeholder="Short bio about yourself"
                className={`${inputClass} mt-1 h-20`}
              />
            </div>
            <div>
              <label className={labelClass}>Avatar URL</label>
              <input
                value={block.content.avatar}
                onChange={(e) => updateBlock(block.id, { ...block.content, avatar: e.target.value })}
                placeholder="https://..."
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
        );
      case "link":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Button Text</label>
              <input
                value={block.content.title}
                onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                placeholder="My Website"
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>URL</label>
              <input
                value={block.content.url}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                placeholder="https://..."
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Title (optional)</label>
              <input
                value={block.content.title}
                onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                placeholder="Section title"
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>Text</label>
              <textarea
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                placeholder="Your text content..."
                className={`${inputClass} mt-1 h-24`}
              />
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Email</label>
              <input
                value={block.content.email}
                onChange={(e) => updateBlock(block.id, { ...block.content, email: e.target.value })}
                placeholder="you@example.com"
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                value={block.content.phone}
                onChange={(e) => updateBlock(block.id, { ...block.content, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input
                value={block.content.address}
                onChange={(e) => updateBlock(block.id, { ...block.content, address: e.target.value })}
                placeholder="123 Main St, City"
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
        );
      case "divider":
        return (
          <div>
            <label className={labelClass}>Divider Text (optional)</label>
            <input
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              placeholder="OR"
              className={`${inputClass} mt-1`}
            />
          </div>
        );
      case "image":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Image URL</label>
              <input
                value={block.content.url}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                placeholder="https://..."
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>Alt Text</label>
              <input
                value={block.content.alt}
                onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
                placeholder="Image description"
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
        );
      case "social":
        const platforms = ["twitter", "instagram", "linkedin", "github", "youtube", "facebook"];
        return (
          <div className="space-y-3">
            <label className={labelClass}>Social Links</label>
            <div className="space-y-2">
              {platforms.map((platform) => {
                const existing = block.content.links?.find((l: any) => l.platform === platform);
                return (
                  <div key={platform} className="flex items-center gap-2">
                    <span className="w-24 capitalize text-sm text-gray-400">{platform}</span>
                    <input
                      value={existing?.url || ""}
                      onChange={(e) => {
                        const links = block.content.links || [];
                        const idx = links.findIndex((l: any) => l.platform === platform);
                        if (e.target.value) {
                          if (idx >= 0) {
                            links[idx].url = e.target.value;
                          } else {
                            links.push({ platform, url: e.target.value });
                          }
                        } else if (idx >= 0) {
                          links.splice(idx, 1);
                        }
                        updateBlock(block.id, { ...block.content, links: [...links] });
                      }}
                      placeholder={`https://${platform}.com/...`}
                      className={`flex-1 ${inputClass}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a1f]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader title="Pages" />

        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={FileText} color="bg-violet-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{pages.length}</div>
                  <div className="text-xs text-gray-400">Total Pages</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Eye} color="bg-emerald-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Total Views</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Globe} color="bg-cyan-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {pages.filter(p => p.status === "published").length}
                  </div>
                  <div className="text-xs text-gray-400">Published</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Layers} color="bg-amber-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {pages.reduce((acc, p) => acc + p.blocks.length, 0)}
                  </div>
                  <div className="text-xs text-gray-400">Total Blocks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              <Plus className="h-4 w-4" />
              Create Page
            </button>
          </div>

          {/* Pages Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-400" />
              <p className="text-sm text-gray-400 mt-2">Loading pages...</p>
            </div>
          ) : filteredPages.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map((page, index) => {
                const colors = ["bg-violet-500", "bg-emerald-500", "bg-cyan-500", "bg-amber-500", "bg-rose-500", "bg-blue-500"];
                const iconColor = colors[index % colors.length];

                return (
                  <div
                    key={page.id}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all group hover:shadow-lg hover:shadow-violet-500/10 overflow-hidden"
                  >
                    {/* Preview */}
                    <div
                      className="h-32 flex items-center justify-center relative"
                      style={{
                        backgroundColor: THEMES.find((t) => t.id === page.theme)?.bg || "#f8fafc",
                      }}
                    >
                      <div className="text-center">
                        <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <span className="text-xs opacity-60">{page.type} page</span>
                      </div>
                      <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                        page.status === "published"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {page.status}
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Info */}
                      <h3 className="font-semibold text-white">{page.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="h-3.5 w-3.5" />
                        <span>/bio/{page.slug}</span>
                        <button
                          onClick={() => copyLink(page.slug)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copied === page.slug ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{page.viewCount} views</span>
                        <span>{page.blocks.length} blocks</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        <button
                          onClick={() => handleEdit(page)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => window.open(`/bio/${page.slug}`, "_blank")}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => togglePublish(page.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {page.status === "published" ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Globe className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => deletePage(page.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-dashed border-white/10 p-12 text-center">
              <div className="relative h-16 w-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-violet-500 rounded-full opacity-20 blur-xl" />
                <div className="relative h-16 w-16 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-white/10">
                  <FileText className="h-8 w-8 text-violet-400" />
                </div>
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">No Pages Yet</h3>
              <p className="text-gray-400 mb-6">Create your first bio link or landing page</p>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all"
              >
                <Plus className="h-4 w-4" />
                Create Page
              </button>
            </div>
          )}
        </div>

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-[#1a1425] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Page</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a bio link page or landing page
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className={labelClass}>Page Title</label>
                <input
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  placeholder="My Bio Page"
                  className={`${inputClass} mt-1.5`}
                />
              </div>
              <div>
                <label className={labelClass}>URL Slug</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm text-gray-500">/bio/</span>
                  <input
                    value={newPage.slug}
                    onChange={(e) =>
                      setNewPage({
                        ...newPage,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    placeholder="yourname"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description (optional)</label>
                <input
                  value={newPage.description}
                  onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                  placeholder="Short description"
                  className={`${inputClass} mt-1.5`}
                />
              </div>
              <div>
                <label className={labelClass}>Page Type</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { id: "bio", label: "Bio Link", icon: User },
                    { id: "landing", label: "Landing Page", icon: LayoutTemplate },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setNewPage({ ...newPage, type: type.id })}
                      className={cn(
                        "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                        newPage.type === type.id
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/10 hover:border-violet-500/50 bg-white/5"
                      )}
                    >
                      <type.icon className="h-6 w-6 text-gray-300" />
                      <span className="text-sm font-medium text-gray-300">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Theme</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setNewPage({ ...newPage, theme: theme.id })}
                      className={cn(
                        "w-10 h-10 rounded-lg border-2 transition-all",
                        newPage.theme === theme.id
                          ? "border-violet-500 ring-2 ring-violet-500/30"
                          : "border-white/10"
                      )}
                      style={{ backgroundColor: theme.bg }}
                      title={theme.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newPage.title || !newPage.slug || saving}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Creating..." : "Create & Edit"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog (Page Builder) */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-[#1a1425] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Page: {editingPage?.title}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Drag and drop blocks to build your page
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden grid lg:grid-cols-2 gap-6 mt-4">
              {/* Block Editor */}
              <div className="overflow-y-auto space-y-4 pr-2">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Add Blocks</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {BLOCK_TYPES.map((bt) => (
                      <button
                        key={bt.type}
                        onClick={() => addBlock(bt.type)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 text-gray-300 transition-all"
                      >
                        <bt.icon className="h-4 w-4" />
                        {bt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {blocks.map((block, index) => {
                    const blockType = BLOCK_TYPES.find((b) => b.type === block.type);
                    return (
                      <div key={block.id} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {blockType && (
                              <blockType.icon className="h-4 w-4 text-violet-400" />
                            )}
                            <span className="font-medium text-sm text-white">
                              {blockType?.label || block.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveBlock(block.id, "up")}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-gray-400"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => moveBlock(block.id, "down")}
                              disabled={index === blocks.length - 1}
                              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-gray-400"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeBlock(block.id)}
                              className="p-1 rounded hover:bg-red-500/10 text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {renderBlockEditor(block)}
                      </div>
                    );
                  })}
                </div>

                {blocks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <LayoutTemplate className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Add blocks to build your page</p>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="bg-white/5 px-3 py-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-gray-400">
                    /bio/{editingPage?.slug}
                  </div>
                </div>
                <div
                  className="h-[500px] overflow-y-auto"
                  style={{
                    backgroundColor: THEMES.find((t) => t.id === editingPage?.theme)?.bg || "#f8fafc",
                  }}
                >
                  <div className="p-6 max-w-sm mx-auto space-y-3">
                    {blocks.map((block) => {
                      if (block.type === "header" && block.content.title) {
                        return (
                          <div key={block.id} className="text-center mb-6">
                            {block.content.avatar && (
                              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-white shadow">
                                <img src={block.content.avatar} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <h1 className="text-xl font-bold">{block.content.title}</h1>
                            {block.content.subtitle && (
                              <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                            )}
                            {block.content.bio && (
                              <p className="text-sm text-gray-500 mt-2">{block.content.bio}</p>
                            )}
                          </div>
                        );
                      }
                      if (block.type === "link" && block.content.title) {
                        return (
                          <div key={block.id} className="bg-white rounded-xl p-3 text-center shadow-sm">
                            {block.content.title}
                          </div>
                        );
                      }
                      if (block.type === "text" && block.content.text) {
                        return (
                          <div key={block.id} className="bg-white rounded-xl p-3 shadow-sm">
                            {block.content.title && (
                              <h3 className="font-medium mb-1">{block.content.title}</h3>
                            )}
                            <p className="text-sm text-gray-600">{block.content.text}</p>
                          </div>
                        );
                      }
                      if (block.type === "divider") {
                        return (
                          <div key={block.id} className="flex items-center gap-3 py-2">
                            <div className="flex-1 h-px bg-gray-300" />
                            {block.content.text && (
                              <span className="text-xs text-gray-500">{block.content.text}</span>
                            )}
                            <div className="flex-1 h-px bg-gray-300" />
                          </div>
                        );
                      }
                      if (block.type === "social" && block.content.links?.length > 0) {
                        return (
                          <div key={block.id} className="flex justify-center gap-3">
                            {block.content.links.map((link: any, i: number) => (
                              <div key={i} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
                                <Globe className="h-5 w-5 text-gray-600" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      if (block.type === "contact") {
                        return (
                          <div key={block.id} className="bg-white rounded-xl p-3 shadow-sm text-sm space-y-2">
                            {block.content.email && <div>Email: {block.content.email}</div>}
                            {block.content.phone && <div>Phone: {block.content.phone}</div>}
                            {block.content.address && <div>Address: {block.content.address}</div>}
                          </div>
                        );
                      }
                      if (block.type === "image" && block.content.url) {
                        return (
                          <div key={block.id} className="rounded-xl overflow-hidden shadow-sm">
                            <img src={block.content.url} alt={block.content.alt || ""} className="w-full" />
                            {block.content.caption && (
                              <p className="p-2 text-xs text-center text-gray-500 bg-white">
                                {block.content.caption}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowEditDialog(false)}
                className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlocks}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
