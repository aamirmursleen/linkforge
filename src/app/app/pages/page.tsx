"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
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
  Copy,
  Check,
  Globe,
  Lock,
  Smartphone,
  Link2,
  User,
  Image,
  Type,
  Minus,
  Contact,
  X,
  Loader2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  MousePointerClick,
  Sparkles,
  LayoutTemplate,
  Palette,
  ArrowRight,
  MessageSquare,
  Video,
  Music,
  ShoppingBag,
  Calendar,
  FileInput,
  Download,
  BarChart3,
  Share2,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Monitor,
  Tablet,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============ TEMPLATES ============
const TEMPLATES = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch",
    icon: FileText,
    color: "bg-slate-500",
    blocks: [],
  },
  {
    id: "creator",
    name: "Content Creator",
    description: "Perfect for influencers",
    icon: User,
    color: "bg-pink-500",
    theme: "sunset",
    blocks: [
      { id: "h1", type: "header", content: { title: "Your Name", subtitle: "Content Creator", bio: "Welcome to my page! Find all my links below.", avatar: "" } },
      { id: "s1", type: "social", content: { links: [{ platform: "instagram", url: "" }, { platform: "youtube", url: "" }, { platform: "twitter", url: "" }] } },
      { id: "l1", type: "link", content: { title: "Latest Video", url: "", icon: "play" } },
      { id: "l2", type: "link", content: { title: "Shop My Favorites", url: "", icon: "shop" } },
      { id: "l3", type: "link", content: { title: "Book a Collab", url: "", icon: "calendar" } },
    ],
  },
  {
    id: "business",
    name: "Business Card",
    description: "Professional contact page",
    icon: Contact,
    color: "bg-blue-500",
    theme: "minimal",
    blocks: [
      { id: "h1", type: "header", content: { title: "John Smith", subtitle: "CEO at Company", bio: "Building amazing products.", avatar: "" } },
      { id: "c1", type: "contact", content: { email: "john@company.com", phone: "+1 234 567 890", address: "" } },
      { id: "s1", type: "social", content: { links: [{ platform: "linkedin", url: "" }, { platform: "twitter", url: "" }] } },
      { id: "l1", type: "link", content: { title: "Schedule a Meeting", url: "", icon: "calendar" } },
      { id: "l2", type: "link", content: { title: "Visit Website", url: "", icon: "globe" } },
    ],
  },
  {
    id: "musician",
    name: "Musician",
    description: "Share your music everywhere",
    icon: Music,
    color: "bg-purple-500",
    theme: "dark",
    blocks: [
      { id: "h1", type: "header", content: { title: "Artist Name", subtitle: "Musician | Producer", bio: "New album out now!", avatar: "" } },
      { id: "l1", type: "link", content: { title: "Listen on Spotify", url: "", icon: "music" } },
      { id: "l2", type: "link", content: { title: "Apple Music", url: "", icon: "music" } },
      { id: "l3", type: "link", content: { title: "YouTube Music", url: "", icon: "play" } },
      { id: "s1", type: "social", content: { links: [{ platform: "instagram", url: "" }, { platform: "twitter", url: "" }, { platform: "youtube", url: "" }] } },
    ],
  },
  {
    id: "store",
    name: "Online Store",
    description: "Showcase your products",
    icon: ShoppingBag,
    color: "bg-green-500",
    theme: "default",
    blocks: [
      { id: "h1", type: "header", content: { title: "Shop Name", subtitle: "Handmade with love", bio: "Free shipping on orders over $50", avatar: "" } },
      { id: "l1", type: "link", content: { title: "Shop Now", url: "", icon: "shop" } },
      { id: "l2", type: "link", content: { title: "New Arrivals", url: "", icon: "sparkles" } },
      { id: "l3", type: "link", content: { title: "Sale Items", url: "", icon: "tag" } },
      { id: "f1", type: "form", content: { title: "Get 10% Off", description: "Subscribe for exclusive deals", buttonText: "Subscribe", fields: ["email"] } },
    ],
  },
  {
    id: "lead",
    name: "Lead Generation",
    description: "Capture leads & emails",
    icon: FileInput,
    color: "bg-orange-500",
    theme: "ocean",
    blocks: [
      { id: "h1", type: "header", content: { title: "Free Guide", subtitle: "Download Now", bio: "Learn the secrets to success with our free guide.", avatar: "" } },
      { id: "f1", type: "form", content: { title: "Get Instant Access", description: "Enter your email to download", buttonText: "Download Free", fields: ["name", "email"] } },
      { id: "t1", type: "text", content: { title: "What You'll Learn", text: "• Strategy tips\n• Step-by-step guide\n• Bonus templates" } },
    ],
  },
];

// ============ THEMES ============
const THEMES = [
  { id: "default", name: "Light", bg: "#f8fafc", preview: "bg-gradient-to-br from-slate-50 to-slate-100" },
  { id: "dark", name: "Dark", bg: "#1e293b", preview: "bg-gradient-to-br from-slate-900 to-slate-800" },
  { id: "ocean", name: "Ocean", bg: "#0891b2", preview: "bg-gradient-to-br from-cyan-500 to-blue-600" },
  { id: "sunset", name: "Sunset", bg: "#f97316", preview: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" },
  { id: "forest", name: "Forest", bg: "#16a34a", preview: "bg-gradient-to-br from-green-600 to-emerald-800" },
  { id: "minimal", name: "Minimal", bg: "#ffffff", preview: "bg-white border-2 border-slate-200" },
];

// ============ BLOCK TYPES ============
const BLOCK_TYPES = [
  { type: "header", label: "Header", icon: User, description: "Profile header with avatar", color: "bg-violet-500" },
  { type: "link", label: "Link Button", icon: MousePointerClick, description: "Clickable button", color: "bg-emerald-500" },
  { type: "social", label: "Social Icons", icon: Instagram, description: "Social media links", color: "bg-pink-500" },
  { type: "text", label: "Text Block", icon: Type, description: "Text paragraph", color: "bg-amber-500" },
  { type: "image", label: "Image", icon: Image, description: "Image block", color: "bg-blue-500" },
  { type: "video", label: "Video", icon: Video, description: "YouTube/Video embed", color: "bg-red-500" },
  { type: "form", label: "Lead Form", icon: FileInput, description: "Capture emails/leads", color: "bg-orange-500" },
  { type: "contact", label: "Contact Info", icon: Contact, description: "Email, phone, address", color: "bg-cyan-500" },
  { type: "divider", label: "Divider", icon: Minus, description: "Section separator", color: "bg-slate-500" },
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

function PagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pages, setPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedPageForAction, setSelectedPageForAction] = useState<Page | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Editor states
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageTheme, setPageTheme] = useState("default");
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [step, setStep] = useState<"template" | "details" | "editor">("template");

  useEffect(() => {
    fetchPages();
  }, []);

  // Auto-open template dialog if ?create=true is in URL
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setStep("template");
      setEditingPage(null);
      setBlocks([]);
      setPageTitle("");
      setPageSlug("");
      setPageTheme("default");
      setShowTemplateDialog(true);
      // Remove the query param from URL
      router.replace("/app/pages", { scroll: false });
    }
  }, [searchParams, router]);

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

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/bio/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  // Download page as HTML
  const downloadPage = async (page: Page) => {
    setDownloadingId(page.id);
    try {
      const res = await fetch(`/api/pages/${page.id}/download`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${page.slug}-page.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert("Failed to download page");
    } finally {
      setDownloadingId(null);
    }
  };

  // Open analytics
  const openAnalytics = async (page: Page) => {
    setSelectedPageForAction(page);
    setShowAnalyticsDialog(true);
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/pages/${page.id}/analytics?days=30`);
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Open share dialog
  const openShare = (page: Page) => {
    setSelectedPageForAction(page);
    setShowShareDialog(true);
  };

  // Get page URL
  const getPageUrl = (slug: string) => `${window.location.origin}/bio/${slug}`;

  // Start creating a new page
  const startCreatePage = () => {
    setStep("template");
    setEditingPage(null);
    setBlocks([]);
    setPageTitle("");
    setPageSlug("");
    setPageTheme("default");
    setShowTemplateDialog(true);
  };

  // Select template
  const selectTemplate = (template: typeof TEMPLATES[0]) => {
    setBlocks(template.blocks.map(b => ({ ...b, id: `block-${Date.now()}-${Math.random()}` })));
    setPageTheme(template.theme || "default");
    setStep("details");
  };

  // Continue to editor
  const continueToEditor = async () => {
    if (!pageTitle || !pageSlug) return;

    setSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: pageSlug.toLowerCase().replace(/\s+/g, "-"),
          title: pageTitle,
          type: "bio",
          theme: pageTheme,
          blocks: blocks,
          status: "draft",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingPage(data.data);
        setBlocks(data.data.blocks || []);
        setShowTemplateDialog(false);
        setShowEditorDialog(true);
      } else {
        alert(data.error || "Failed to create page");
      }
    } catch (error) {
      alert("Failed to create page");
    } finally {
      setSaving(false);
    }
  };

  // Edit existing page
  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setBlocks([...page.blocks]);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageTheme(page.theme);
    setShowEditorDialog(true);
  };

  // Save page
  const handleSave = async () => {
    if (!editingPage) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${editingPage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks, theme: pageTheme }),
      });
      const data = await res.json();
      if (data.success) {
        setPages(pages.map((p) => p.id === editingPage.id ? { ...p, blocks, theme: pageTheme } : p));
        fetchPages();
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (error) {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Add block
  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "header": return { title: "", subtitle: "", bio: "", avatar: "" };
      case "link": return { title: "", url: "", icon: "link" };
      case "social": return { links: [] };
      case "text": return { title: "", text: "" };
      case "divider": return { text: "" };
      case "image": return { url: "", alt: "", caption: "" };
      case "video": return { type: "youtube", videoId: "", url: "" };
      case "contact": return { email: "", phone: "", address: "" };
      case "form": return { title: "Subscribe", description: "", buttonText: "Submit", fields: ["email"] };
      default: return {};
    }
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) return;
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

  // ============ BLOCK EDITOR ============
  const renderBlockEditor = (block: Block) => {
    const inputClass = "w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm";
    const labelClass = "block text-xs font-medium text-slate-600 mb-1";

    switch (block.type) {
      case "header":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Name / Title</label>
              <input value={block.content.title} onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })} placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input value={block.content.subtitle} onChange={(e) => updateBlock(block.id, { ...block.content, subtitle: e.target.value })} placeholder="Creator, Developer, etc." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea value={block.content.bio} onChange={(e) => updateBlock(block.id, { ...block.content, bio: e.target.value })} placeholder="Short description" className={`${inputClass} h-16 resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Avatar URL</label>
              <input value={block.content.avatar} onChange={(e) => updateBlock(block.id, { ...block.content, avatar: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
          </div>
        );

      case "link":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Button Text</label>
              <input value={block.content.title} onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })} placeholder="My Website" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>URL</label>
              <input value={block.content.url} onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Title (optional)</label>
              <input value={block.content.title} onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })} placeholder="Section title" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Text</label>
              <textarea value={block.content.text} onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })} placeholder="Your text..." className={`${inputClass} h-20 resize-none`} />
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Email</label>
              <input value={block.content.email} onChange={(e) => updateBlock(block.id, { ...block.content, email: e.target.value })} placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={block.content.phone} onChange={(e) => updateBlock(block.id, { ...block.content, phone: e.target.value })} placeholder="+1 234 567 8900" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input value={block.content.address} onChange={(e) => updateBlock(block.id, { ...block.content, address: e.target.value })} placeholder="City, Country" className={inputClass} />
            </div>
          </div>
        );

      case "form":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Form Title</label>
              <input value={block.content.title} onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })} placeholder="Subscribe to newsletter" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input value={block.content.description} onChange={(e) => updateBlock(block.id, { ...block.content, description: e.target.value })} placeholder="Get updates..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Button Text</label>
              <input value={block.content.buttonText} onChange={(e) => updateBlock(block.id, { ...block.content, buttonText: e.target.value })} placeholder="Subscribe" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fields</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["name", "email", "phone"].map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      const fields = block.content.fields || [];
                      if (fields.includes(field)) {
                        updateBlock(block.id, { ...block.content, fields: fields.filter((f: string) => f !== field) });
                      } else {
                        updateBlock(block.id, { ...block.content, fields: [...fields, field] });
                      }
                    }}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors capitalize",
                      (block.content.fields || []).includes(field)
                        ? "bg-violet-500 text-white border-violet-500"
                        : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
                    )}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Image URL</label>
              <input value={block.content.url} onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Alt Text</label>
              <input value={block.content.alt} onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })} placeholder="Image description" className={inputClass} />
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>YouTube Video ID</label>
              <input value={block.content.videoId} onChange={(e) => updateBlock(block.id, { ...block.content, videoId: e.target.value })} placeholder="dQw4w9WgXcQ" className={inputClass} />
              <p className="text-xs text-slate-400 mt-1">The part after v= in YouTube URL</p>
            </div>
          </div>
        );

      case "social":
        const platforms = ["instagram", "twitter", "youtube", "linkedin", "github", "facebook"];
        return (
          <div className="space-y-2">
            <label className={labelClass}>Social Links</label>
            {platforms.map((platform) => {
              const existing = block.content.links?.find((l: any) => l.platform === platform);
              return (
                <div key={platform} className="flex items-center gap-2">
                  <span className="w-20 text-xs text-slate-500 capitalize">{platform}</span>
                  <input
                    value={existing?.url || ""}
                    onChange={(e) => {
                      const links = block.content.links || [];
                      const idx = links.findIndex((l: any) => l.platform === platform);
                      if (e.target.value) {
                        if (idx >= 0) links[idx].url = e.target.value;
                        else links.push({ platform, url: e.target.value });
                      } else if (idx >= 0) links.splice(idx, 1);
                      updateBlock(block.id, { ...block.content, links: [...links] });
                    }}
                    placeholder={`${platform}.com/...`}
                    className={`flex-1 ${inputClass}`}
                  />
                </div>
              );
            })}
          </div>
        );

      case "divider":
        return (
          <div>
            <label className={labelClass}>Divider Text (optional)</label>
            <input value={block.content.text} onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })} placeholder="OR" className={inputClass} />
          </div>
        );

      default:
        return null;
    }
  };

  // ============ LIVE PREVIEW ============
  const renderPreviewBlock = (block: Block) => {
    const isDark = pageTheme === "dark";
    const textClass = isDark ? "text-white" : "text-slate-900";
    const mutedClass = isDark ? "text-slate-400" : "text-slate-600";
    const cardClass = isDark ? "bg-slate-800 border-slate-700" : "bg-white shadow-sm";

    switch (block.type) {
      case "header":
        return (
          <div className="text-center mb-4">
            {block.content.avatar && (
              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-white/30 shadow-lg">
                <img src={block.content.avatar} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className={cn("text-xl font-bold", textClass)}>{block.content.title || "Your Name"}</h1>
            {block.content.subtitle && <p className={cn("text-sm", mutedClass)}>{block.content.subtitle}</p>}
            {block.content.bio && <p className={cn("text-xs mt-2 max-w-xs mx-auto", mutedClass)}>{block.content.bio}</p>}
          </div>
        );

      case "link":
        return (
          <div className={cn("p-3 rounded-xl text-center border transition-all hover:scale-[1.02]", cardClass)}>
            <span className={cn("text-sm font-medium", textClass)}>{block.content.title || "Button Text"}</span>
          </div>
        );

      case "social":
        const icons: any = { instagram: Instagram, twitter: Twitter, youtube: Youtube, linkedin: Linkedin, github: Github, facebook: Globe };
        return (
          <div className="flex justify-center gap-2">
            {(block.content.links?.length > 0 ? block.content.links : [{ platform: "instagram" }, { platform: "twitter" }]).map((s: any, i: number) => {
              const Icon = icons[s.platform] || Globe;
              return (
                <div key={i} className={cn("w-10 h-10 rounded-full flex items-center justify-center border", cardClass)}>
                  <Icon className={cn("w-4 h-4", mutedClass)} />
                </div>
              );
            })}
          </div>
        );

      case "text":
        return (
          <div className={cn("p-3 rounded-xl border", cardClass)}>
            {block.content.title && <h3 className={cn("text-sm font-semibold mb-1", textClass)}>{block.content.title}</h3>}
            <p className={cn("text-xs whitespace-pre-wrap", mutedClass)}>{block.content.text || "Your text here..."}</p>
          </div>
        );

      case "form":
        return (
          <div className={cn("p-4 rounded-xl border", cardClass)}>
            <h3 className={cn("text-sm font-semibold mb-1", textClass)}>{block.content.title || "Subscribe"}</h3>
            {block.content.description && <p className={cn("text-xs mb-3", mutedClass)}>{block.content.description}</p>}
            <div className="space-y-2">
              {(block.content.fields || ["email"]).map((f: string) => (
                <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50" disabled />
              ))}
              <button className="w-full py-2 bg-violet-500 text-white text-xs font-medium rounded-lg">
                {block.content.buttonText || "Submit"}
              </button>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className={cn("p-3 rounded-xl border space-y-2", cardClass)}>
            {block.content.email && (
              <div className="flex items-center gap-2">
                <Mail className={cn("w-4 h-4", mutedClass)} />
                <span className={cn("text-xs", textClass)}>{block.content.email}</span>
              </div>
            )}
            {block.content.phone && (
              <div className="flex items-center gap-2">
                <Phone className={cn("w-4 h-4", mutedClass)} />
                <span className={cn("text-xs", textClass)}>{block.content.phone}</span>
              </div>
            )}
            {block.content.address && (
              <div className="flex items-center gap-2">
                <MapPin className={cn("w-4 h-4", mutedClass)} />
                <span className={cn("text-xs", textClass)}>{block.content.address}</span>
              </div>
            )}
          </div>
        );

      case "image":
        return block.content.url ? (
          <div className={cn("rounded-xl overflow-hidden border", cardClass)}>
            <img src={block.content.url} alt={block.content.alt} className="w-full h-auto" />
          </div>
        ) : (
          <div className={cn("rounded-xl border p-8 text-center", cardClass)}>
            <Image className={cn("w-8 h-8 mx-auto mb-2", mutedClass)} />
            <span className={cn("text-xs", mutedClass)}>Image Preview</span>
          </div>
        );

      case "video":
        return block.content.videoId ? (
          <div className="aspect-video rounded-xl overflow-hidden">
            <iframe src={`https://www.youtube.com/embed/${block.content.videoId}`} className="w-full h-full" allowFullScreen />
          </div>
        ) : (
          <div className={cn("rounded-xl border p-8 text-center aspect-video flex flex-col items-center justify-center", cardClass)}>
            <Video className={cn("w-8 h-8 mb-2", mutedClass)} />
            <span className={cn("text-xs", mutedClass)}>Video Preview</span>
          </div>
        );

      case "divider":
        return (
          <div className="flex items-center gap-3 py-1">
            <div className={cn("flex-1 h-px", isDark ? "bg-slate-700" : "bg-slate-200")} />
            {block.content.text && <span className={cn("text-xs", mutedClass)}>{block.content.text}</span>}
            <div className={cn("flex-1 h-px", isDark ? "bg-slate-700" : "bg-slate-200")} />
          </div>
        );

      default:
        return null;
    }
  };

  const currentTheme = THEMES.find(t => t.id === pageTheme) || THEMES[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader title="Bio Pages" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search pages..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={startCreatePage}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-500/25"
          >
            <Plus className="h-4 w-4" />
            Create Page
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{pages.length}</div>
                <div className="text-xs text-slate-500">Total Pages</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{pages.filter(p => p.status === "published").length}</div>
                <div className="text-xs text-slate-500">Published</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{pages.reduce((a, p) => a + p.viewCount, 0).toLocaleString()}</div>
                <div className="text-xs text-slate-500">Total Views</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <MousePointerClick className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{pages.reduce((a, p) => a + p.blocks.length, 0)}</div>
                <div className="text-xs text-slate-500">Total Blocks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pages Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-500" />
            <p className="text-sm text-slate-500 mt-2">Loading pages...</p>
          </div>
        ) : filteredPages.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <div key={page.id} className="bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all overflow-hidden group">
                <div className={cn("h-32 flex items-center justify-center relative", THEMES.find(t => t.id === page.theme)?.preview || "bg-slate-100")}>
                  <Smartphone className="h-8 w-8 opacity-30" />
                  <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full ${page.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {page.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{page.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Globe className="h-3.5 w-3.5" />
                    <span>/bio/{page.slug}</span>
                    <button onClick={() => copyLink(page.slug)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied === page.slug ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                    <span>{page.viewCount} views</span>
                    <span>{page.blocks.length} blocks</span>
                  </div>
                  {/* Quick Actions Row */}
                  <div className="flex items-center gap-1 pt-3 mt-3 border-t border-slate-100">
                    <button onClick={() => openShare(page)} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-violet-50 hover:bg-violet-100 rounded-lg text-violet-700 text-sm font-medium transition-colors">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                    <button onClick={() => openAnalytics(page)} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 text-sm font-medium transition-colors">
                      <BarChart3 className="h-4 w-4" /> Stats
                    </button>
                    <button onClick={() => handleEdit(page)} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-colors">
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                  </div>
                  {/* Secondary Actions Row */}
                  <div className="flex items-center gap-1 mt-2">
                    <button onClick={() => downloadPage(page)} disabled={downloadingId === page.id} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors">
                      {downloadingId === page.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} Download
                    </button>
                    <button onClick={() => window.open(`/bio/${page.slug}`, "_blank")} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors">
                      <ExternalLink className="h-3 w-3" /> Preview
                    </button>
                    <button onClick={() => togglePublish(page.id)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors">
                      {page.status === "published" ? <><Lock className="h-3 w-3" /> Unpublish</> : <><Globe className="h-3 w-3" /> Publish</>}
                    </button>
                    <button onClick={() => deletePage(page.id)} className="px-2 py-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-violet-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg mb-2">Create your first page</h3>
            <p className="text-slate-500 mb-6">Build a beautiful bio link or landing page in minutes</p>
            <button onClick={startCreatePage} className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all">
              <Plus className="h-4 w-4" /> Create Page
            </button>
          </div>
        )}
      </div>

      {/* ============ TEMPLATE SELECTION DIALOG ============ */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{step === "template" ? "Choose a Template" : "Page Details"}</DialogTitle>
            <DialogDescription>
              {step === "template" ? "Start with a template or blank page" : "Name your page and customize the theme"}
            </DialogDescription>
          </DialogHeader>

          {step === "template" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 overflow-y-auto">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => selectTemplate(template)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-all text-left group"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", template.color)}>
                    <template.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-violet-700">{template.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                <input
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="My Bio Page"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">/bio/</span>
                  <input
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="yourname"
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                <div className="flex flex-wrap gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setPageTheme(theme.id)}
                      className={cn(
                        "w-12 h-12 rounded-lg transition-all",
                        theme.preview,
                        pageTheme === theme.id ? "ring-2 ring-violet-500 ring-offset-2" : ""
                      )}
                      title={theme.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            {step === "details" && (
              <button onClick={() => setStep("template")} className="px-4 py-2 text-slate-600 hover:text-slate-900">
                Back
              </button>
            )}
            <button onClick={() => setShowTemplateDialog(false)} className="px-4 py-2 text-slate-600 hover:text-slate-900">
              Cancel
            </button>
            {step === "details" && (
              <button
                onClick={continueToEditor}
                disabled={!pageTitle || !pageSlug || saving}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Create & Edit <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ PAGE EDITOR DIALOG ============ */}
      <Dialog open={showEditorDialog} onOpenChange={setShowEditorDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
            <div>
              <h2 className="font-semibold text-slate-900">{editingPage?.title || "Edit Page"}</h2>
              <p className="text-sm text-slate-500">/bio/{editingPage?.slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={pageTheme}
                onChange={(e) => setPageTheme(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} Theme</option>
                ))}
              </select>
              <button onClick={() => setShowEditorDialog(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Block List & Editor */}
            <div className="w-1/2 border-r flex flex-col bg-slate-50">
              {/* Add Block Buttons */}
              <div className="p-4 border-b bg-white">
                <p className="text-xs text-slate-500 mb-2 font-medium">ADD BLOCKS</p>
                <div className="flex flex-wrap gap-1.5">
                  {BLOCK_TYPES.map((bt) => (
                    <button
                      key={bt.type}
                      onClick={() => addBlock(bt.type)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 hover:border-violet-400 hover:bg-violet-50 text-slate-700 transition-all"
                    >
                      <bt.icon className="h-3.5 w-3.5" />
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blocks List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {blocks.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <LayoutTemplate className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Click a block type above to add it</p>
                  </div>
                ) : (
                  blocks.map((block, index) => {
                    const blockType = BLOCK_TYPES.find((b) => b.type === block.type);
                    const isSelected = selectedBlockId === block.id;
                    return (
                      <div
                        key={block.id}
                        className={cn(
                          "bg-white rounded-xl border-2 transition-all",
                          isSelected ? "border-violet-400 shadow-lg" : "border-slate-200"
                        )}
                      >
                        <div
                          className="flex items-center justify-between p-3 cursor-pointer"
                          onClick={() => setSelectedBlockId(isSelected ? null : block.id)}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-slate-300" />
                            {blockType && <blockType.icon className="h-4 w-4 text-violet-500" />}
                            <span className="text-sm font-medium text-slate-700">{blockType?.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }} disabled={index === 0} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30">
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }} disabled={index === blocks.length - 1} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30">
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="p-1 rounded hover:bg-red-50">
                              <X className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="px-3 pb-3 border-t border-slate-100 pt-3">
                            {renderBlockEditor(block)}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Mobile Preview */}
            <div className="w-1/2 bg-slate-100 p-6 flex flex-col items-center overflow-y-auto">
              <p className="text-xs text-slate-500 mb-4 font-medium">MOBILE PREVIEW</p>
              <div className="w-[320px] bg-slate-800 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-black rounded-[2.5rem] overflow-hidden">
                  {/* Phone notch */}
                  <div className="bg-black h-8 flex items-center justify-center">
                    <div className="w-20 h-5 bg-black rounded-full" />
                  </div>
                  {/* Screen */}
                  <div className={cn("h-[500px] overflow-y-auto", currentTheme.preview)}>
                    <div className="p-4 space-y-3">
                      {blocks.map((block) => (
                        <div key={block.id}>{renderPreviewBlock(block)}</div>
                      ))}
                      {blocks.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                          <Smartphone className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">Add blocks to see preview</p>
                        </div>
                      )}
                      {/* Powered by */}
                      <div className="pt-6 text-center">
                        <span className={cn("text-xs opacity-50", pageTheme === "dark" ? "text-white" : "text-slate-600")}>
                          Powered by LinkForge
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
            <button
              onClick={() => window.open(`/bio/${editingPage?.slug}`, "_blank")}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              <Eye className="h-4 w-4" /> Preview Live
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowEditorDialog(false)} className="px-4 py-2 text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium rounded-xl flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ ANALYTICS DIALOG ============ */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Analytics: {selectedPageForAction?.title}
            </DialogTitle>
            <DialogDescription>
              View statistics for /bio/{selectedPageForAction?.slug}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : analyticsData ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs font-medium">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{analyticsData.summary.totalViews.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-xs font-medium">Unique Visitors</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{analyticsData.summary.uniqueVisitors.toLocaleString()}</div>
                  </div>
                  <div className="bg-violet-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-violet-600 mb-1">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-xs font-medium">Avg/Day</span>
                    </div>
                    <div className="text-2xl font-bold text-violet-900">{analyticsData.summary.avgViewsPerDay}</div>
                  </div>
                  <div className={cn("rounded-xl p-4", analyticsData.summary.growth >= 0 ? "bg-emerald-50" : "bg-red-50")}>
                    <div className={cn("flex items-center gap-2 mb-1", analyticsData.summary.growth >= 0 ? "text-emerald-600" : "text-red-600")}>
                      {analyticsData.summary.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-xs font-medium">Growth</span>
                    </div>
                    <div className={cn("text-2xl font-bold", analyticsData.summary.growth >= 0 ? "text-emerald-900" : "text-red-900")}>
                      {analyticsData.summary.growth >= 0 ? "+" : ""}{analyticsData.summary.growth}%
                    </div>
                  </div>
                </div>

                {/* Daily Views Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900 mb-4">Views (Last 30 Days)</h3>
                  <div className="h-40 flex items-end gap-1">
                    {analyticsData.dailyViews.map((day: any, i: number) => {
                      const maxViews = Math.max(...analyticsData.dailyViews.map((d: any) => d.views), 1);
                      const height = (day.views / maxViews) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                          <div className="relative w-full">
                            <div
                              className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                              style={{ height: `${Math.max(height, 2)}px` }}
                            />
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {day.date}: {day.views} views
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Device & Source Stats */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Devices */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Devices</h3>
                    <div className="space-y-2">
                      {analyticsData.deviceStats.map((d: any) => (
                        <div key={d.device} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            {d.device === "mobile" ? <Smartphone className="h-4 w-4 text-slate-600" /> :
                             d.device === "tablet" ? <Tablet className="h-4 w-4 text-slate-600" /> :
                             <Monitor className="h-4 w-4 text-slate-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize text-slate-700">{d.device}</span>
                              <span className="text-slate-500">{d.percentage}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full mt-1">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${d.percentage}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sources */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Traffic Sources</h3>
                    <div className="space-y-2">
                      {analyticsData.sourceStats.slice(0, 5).map((s: any) => (
                        <div key={s.source} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            {s.source === "instagram" ? <Instagram className="h-4 w-4 text-pink-500" /> :
                             s.source === "twitter" ? <Twitter className="h-4 w-4 text-blue-400" /> :
                             s.source === "youtube" ? <Youtube className="h-4 w-4 text-red-500" /> :
                             s.source === "linkedin" ? <Linkedin className="h-4 w-4 text-blue-600" /> :
                             s.source === "facebook" ? <Globe className="h-4 w-4 text-blue-500" /> :
                             <Globe className="h-4 w-4 text-slate-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize text-slate-700">{s.source}</span>
                              <span className="text-slate-500">{s.count}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full mt-1">
                              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${s.percentage}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Browser & OS */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Browsers</h3>
                    <div className="space-y-2">
                      {analyticsData.browserStats.map((b: any) => (
                        <div key={b.browser} className="flex justify-between text-sm">
                          <span className="text-slate-700">{b.browser}</span>
                          <span className="text-slate-500">{b.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Operating Systems</h3>
                    <div className="space-y-2">
                      {analyticsData.osStats.map((o: any) => (
                        <div key={o.os} className="flex justify-between text-sm">
                          <span className="text-slate-700">{o.os}</span>
                          <span className="text-slate-500">{o.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No analytics data available yet</p>
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <button onClick={() => setShowAnalyticsDialog(false)} className="px-4 py-2 text-slate-600 hover:text-slate-900">
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ SHARE DIALOG ============ */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-violet-500" />
              Share Page
            </DialogTitle>
            <DialogDescription>
              Copy your page link or share on social media
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Page URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Page Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedPageForAction ? getPageUrl(selectedPageForAction.slug) : ""}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm"
                />
                <button
                  onClick={() => selectedPageForAction && copyLink(selectedPageForAction.slug)}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center gap-2 transition-colors"
                >
                  {copied === selectedPageForAction?.slug ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === selectedPageForAction?.slug ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Share on</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    const url = encodeURIComponent(getPageUrl(selectedPageForAction?.slug || ""));
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=Check out my page!`, "_blank");
                  }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <span className="text-xs text-slate-600">Twitter</span>
                </button>
                <button
                  onClick={() => {
                    const url = encodeURIComponent(getPageUrl(selectedPageForAction?.slug || ""));
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
                  }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="text-xs text-slate-600">Facebook</span>
                </button>
                <button
                  onClick={() => {
                    const url = encodeURIComponent(getPageUrl(selectedPageForAction?.slug || ""));
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
                  }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-blue-700" />
                  <span className="text-xs text-slate-600">LinkedIn</span>
                </button>
                <button
                  onClick={() => {
                    const url = getPageUrl(selectedPageForAction?.slug || "");
                    const text = encodeURIComponent(`Check out my page: ${url}`);
                    window.open(`https://wa.me/?text=${text}`, "_blank");
                  }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <span className="text-xs text-slate-600">WhatsApp</span>
                </button>
              </div>
            </div>

            {/* QR Code hint */}
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-600">
                Want a QR code for this page?
              </p>
              <button
                onClick={() => {
                  setShowShareDialog(false);
                  router.push(`/app/qr?url=${encodeURIComponent(getPageUrl(selectedPageForAction?.slug || ""))}`);
                }}
                className="mt-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Create QR Code →
              </button>
            </div>
          </div>

          <DialogFooter>
            <button onClick={() => setShowShareDialog(false)} className="px-4 py-2 text-slate-600 hover:text-slate-900">
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50">
        <AppHeader title="Bio Pages" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      </div>
    }>
      <PagesContent />
    </Suspense>
  );
}
