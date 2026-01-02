"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Block types
const BLOCK_TYPES = [
  { type: "header", label: "Header", icon: User, description: "Profile header with avatar" },
  { type: "link", label: "Link", icon: Link2, description: "Clickable button link" },
  { type: "social", label: "Social Icons", icon: Globe, description: "Social media icons" },
  { type: "text", label: "Text", icon: Type, description: "Text paragraph" },
  { type: "divider", label: "Divider", icon: Minus, description: "Section divider" },
  { type: "image", label: "Image", icon: Image, description: "Image block" },
  { type: "contact", label: "Contact", icon: Contact, description: "Contact information" },
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

// Mock data
const mockPages: Page[] = [
  {
    id: "1",
    slug: "johndoe",
    title: "John Doe",
    description: "Digital Creator & Developer",
    type: "bio",
    status: "published",
    theme: "ocean",
    blocks: [
      {
        id: "b1",
        type: "header",
        content: {
          title: "John Doe",
          subtitle: "Digital Creator & Developer",
          bio: "Building cool stuff on the internet",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        },
      },
      {
        id: "b2",
        type: "link",
        content: { title: "My Portfolio", url: "https://example.com", icon: "🌐" },
      },
      {
        id: "b3",
        type: "link",
        content: { title: "Latest Project", url: "https://example.com/project", icon: "🚀" },
      },
      {
        id: "b4",
        type: "social",
        content: {
          links: [
            { platform: "twitter", url: "https://twitter.com" },
            { platform: "instagram", url: "https://instagram.com" },
            { platform: "linkedin", url: "https://linkedin.com" },
            { platform: "github", url: "https://github.com" },
          ],
        },
      },
    ],
    viewCount: 1243,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    slug: "startup",
    title: "Startup Landing",
    description: "Product launch page",
    type: "landing",
    status: "draft",
    theme: "sunset",
    blocks: [],
    viewCount: 0,
    createdAt: "2024-01-10",
  },
];

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>(mockPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // New page form state
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    description: "",
    type: "bio",
    theme: "default",
  });

  // Block editor state
  const [blocks, setBlocks] = useState<Block[]>([]);

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

  const handleCreate = () => {
    const page: Page = {
      id: Date.now().toString(),
      slug: newPage.slug.toLowerCase().replace(/\s+/g, "-"),
      title: newPage.title,
      description: newPage.description || null,
      type: newPage.type,
      status: "draft",
      theme: newPage.theme,
      blocks: [],
      viewCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPages([page, ...pages]);
    setShowCreateDialog(false);
    setNewPage({ title: "", slug: "", description: "", type: "bio", theme: "default" });
    // Open editor
    setEditingPage(page);
    setBlocks(page.blocks);
    setShowEditDialog(true);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setBlocks([...page.blocks]);
    setShowEditDialog(true);
  };

  const handleSaveBlocks = () => {
    if (editingPage) {
      setPages(
        pages.map((p) =>
          p.id === editingPage.id ? { ...editingPage, blocks } : p
        )
      );
      setShowEditDialog(false);
      setEditingPage(null);
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
        return { title: "", url: "", icon: "🔗" };
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

  const deletePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
  };

  const togglePublish = (id: string) => {
    setPages(
      pages.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "published" ? "draft" : "published" }
          : p
      )
    );
  };

  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case "header":
        return (
          <div className="space-y-3">
            <div>
              <Label>Name / Title</Label>
              <Input
                value={block.content.title}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, title: e.target.value })
                }
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={block.content.subtitle}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, subtitle: e.target.value })
                }
                placeholder="Developer, Creator, etc."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Bio</Label>
              <textarea
                value={block.content.bio}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, bio: e.target.value })
                }
                placeholder="Short bio about yourself"
                className="mt-1 w-full h-20 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label>Avatar URL</Label>
              <Input
                value={block.content.avatar}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, avatar: e.target.value })
                }
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </div>
        );

      case "link":
        return (
          <div className="space-y-3">
            <div>
              <Label>Button Text</Label>
              <Input
                value={block.content.title}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, title: e.target.value })
                }
                placeholder="My Website"
                className="mt-1"
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={block.content.url}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, url: e.target.value })
                }
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Icon (emoji)</Label>
              <Input
                value={block.content.icon}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, icon: e.target.value })
                }
                placeholder="🔗"
                className="mt-1 w-20"
              />
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-3">
            <div>
              <Label>Title (optional)</Label>
              <Input
                value={block.content.title}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, title: e.target.value })
                }
                placeholder="Section title"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Text</Label>
              <textarea
                value={block.content.text}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, text: e.target.value })
                }
                placeholder="Your text content..."
                className="mt-1 w-full h-24 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              />
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-3">
            <div>
              <Label>Email</Label>
              <Input
                value={block.content.email}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, email: e.target.value })
                }
                placeholder="you@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={block.content.phone}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, phone: e.target.value })
                }
                placeholder="+1 234 567 8900"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={block.content.address}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, address: e.target.value })
                }
                placeholder="123 Main St, City"
                className="mt-1"
              />
            </div>
          </div>
        );

      case "divider":
        return (
          <div>
            <Label>Divider Text (optional)</Label>
            <Input
              value={block.content.text}
              onChange={(e) =>
                updateBlock(block.id, { ...block.content, text: e.target.value })
              }
              placeholder="OR"
              className="mt-1"
            />
          </div>
        );

      case "image":
        return (
          <div className="space-y-3">
            <div>
              <Label>Image URL</Label>
              <Input
                value={block.content.url}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, url: e.target.value })
                }
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={block.content.alt}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, alt: e.target.value })
                }
                placeholder="Image description"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Caption (optional)</Label>
              <Input
                value={block.content.caption}
                onChange={(e) =>
                  updateBlock(block.id, { ...block.content, caption: e.target.value })
                }
                placeholder="Image caption"
                className="mt-1"
              />
            </div>
          </div>
        );

      case "social":
        const platforms = ["twitter", "instagram", "linkedin", "github", "youtube", "facebook"];
        return (
          <div className="space-y-3">
            <Label>Social Links</Label>
            <div className="space-y-2">
              {platforms.map((platform) => {
                const existing = block.content.links?.find(
                  (l: any) => l.platform === platform
                );
                return (
                  <div key={platform} className="flex items-center gap-2">
                    <span className="w-24 capitalize text-sm">{platform}</span>
                    <Input
                      value={existing?.url || ""}
                      onChange={(e) => {
                        const links = block.content.links || [];
                        const idx = links.findIndex(
                          (l: any) => l.platform === platform
                        );
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
                      className="flex-1"
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
    <>
      <AppHeader title="Pages" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <Input
              placeholder="Search pages..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Create Page
          </Button>
        </div>

        {/* Pages Grid */}
        {filteredPages.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <Card key={page.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="pt-6">
                  {/* Preview */}
                  <div
                    className="h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundColor:
                        THEMES.find((t) => t.id === page.theme)?.bg || "#f8fafc",
                    }}
                  >
                    <div className="text-center">
                      <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <span className="text-xs opacity-60">{page.type} page</span>
                    </div>
                    <Badge
                      variant={page.status === "published" ? "success" : "outline"}
                      className="absolute top-2 right-2 text-xs"
                    >
                      {page.status}
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[var(--dark)]">{page.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <Globe className="h-3.5 w-3.5" />
                      <span>/bio/{page.slug}</span>
                      <button
                        onClick={() => copyLink(page.slug)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copied === page.slug ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                      <span>{page.viewCount} views</span>
                      <span>{page.blocks.length} blocks</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(page)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        window.open(`/bio/${page.slug}`, "_blank")
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublish(page.id)}
                    >
                      {page.status === "published" ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePage(page.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center">
              <FileText className="h-16 w-16 mx-auto text-[var(--muted)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                No Pages Yet
              </h3>
              <p className="text-[var(--muted)] mb-6">
                Create your first bio link or landing page
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4" />
                Create Page
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Create a bio link page or landing page
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={newPage.title}
                onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                placeholder="My Bio Page"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm text-[var(--muted)]">/bio/</span>
                <Input
                  id="slug"
                  value={newPage.slug}
                  onChange={(e) =>
                    setNewPage({
                      ...newPage,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="yourname"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={newPage.description}
                onChange={(e) =>
                  setNewPage({ ...newPage, description: e.target.value })
                }
                placeholder="Short description"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Page Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { id: "bio", label: "Bio Link", icon: User },
                  { id: "landing", label: "Landing Page", icon: LayoutTemplate },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewPage({ ...newPage, type: type.id })}
                    className={cn(
                      "p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all",
                      newPage.type === type.id
                        ? "border-[var(--primary)] bg-[var(--primary-pale)]/30"
                        : "border-[var(--border)] hover:border-[var(--primary)]/50"
                    )}
                  >
                    <type.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Theme</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setNewPage({ ...newPage, theme: theme.id })}
                    className={cn(
                      "w-10 h-10 rounded-lg border-2 transition-all",
                      newPage.theme === theme.id
                        ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: theme.bg }}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newPage.title || !newPage.slug}>
              Create & Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog (Page Builder) */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Page: {editingPage?.title}</DialogTitle>
            <DialogDescription>
              Drag and drop blocks to build your page
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden grid lg:grid-cols-2 gap-6 mt-4">
            {/* Block Editor */}
            <div className="overflow-y-auto space-y-4 pr-2">
              <div>
                <Label className="text-xs text-[var(--muted)] uppercase tracking-wide">
                  Add Blocks
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {BLOCK_TYPES.map((bt) => (
                    <button
                      key={bt.type}
                      onClick={() => addBlock(bt.type)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-pale)]/30 transition-all"
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
                    <Card key={block.id} className="relative">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {blockType && (
                              <blockType.icon className="h-4 w-4 text-[var(--primary)]" />
                            )}
                            <span className="font-medium text-sm">
                              {blockType?.label || block.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveBlock(block.id, "up")}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-[var(--border)] disabled:opacity-30"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => moveBlock(block.id, "down")}
                              disabled={index === blocks.length - 1}
                              className="p-1 rounded hover:bg-[var(--border)] disabled:opacity-30"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeBlock(block.id)}
                              className="p-1 rounded hover:bg-red-50 text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {renderBlockEditor(block)}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {blocks.length === 0 && (
                <div className="text-center py-8 text-[var(--muted)]">
                  <LayoutTemplate className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Add blocks to build your page</p>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              <div className="bg-[var(--border)]/50 px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-xs text-[var(--muted)]">
                  /bio/{editingPage?.slug}
                </div>
              </div>
              <div
                className="h-[500px] overflow-y-auto"
                style={{
                  backgroundColor:
                    THEMES.find((t) => t.id === editingPage?.theme)?.bg || "#f8fafc",
                }}
              >
                <div className="p-6 max-w-sm mx-auto space-y-3">
                  {blocks.map((block) => {
                    if (block.type === "header" && block.content.title) {
                      return (
                        <div key={block.id} className="text-center mb-6">
                          {block.content.avatar && (
                            <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-white shadow">
                              <img
                                src={block.content.avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
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
                        <div
                          key={block.id}
                          className="bg-white rounded-xl p-3 text-center shadow-sm"
                        >
                          <span className="mr-2">{block.content.icon}</span>
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
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
                            >
                              <Globe className="h-5 w-5 text-gray-600" />
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (block.type === "contact") {
                      return (
                        <div key={block.id} className="bg-white rounded-xl p-3 shadow-sm text-sm space-y-2">
                          {block.content.email && <div>📧 {block.content.email}</div>}
                          {block.content.phone && <div>📞 {block.content.phone}</div>}
                          {block.content.address && <div>📍 {block.content.address}</div>}
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

          <DialogFooter className="mt-4 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBlocks}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
