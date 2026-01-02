"use client";

import { useState, useRef, useCallback } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  QrCode,
  Plus,
  Search,
  Download,
  ExternalLink,
  MoreHorizontal,
  Link2,
  User,
  Wifi,
  MessageSquare,
  Mail,
  Type,
  Palette,
  Image,
  Frame,
  Copy,
  Check,
  Trash2,
  Edit,
  Eye,
  X,
} from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { cn } from "@/lib/utils";

// QR Types Configuration
const QR_TYPES = [
  { type: "url", label: "URL", icon: Link2, description: "Link to any website" },
  { type: "vcard", label: "Contact", icon: User, description: "Share contact info" },
  { type: "wifi", label: "WiFi", icon: Wifi, description: "Share WiFi credentials" },
  { type: "sms", label: "SMS", icon: MessageSquare, description: "Pre-filled message" },
  { type: "email", label: "Email", icon: Mail, description: "Pre-filled email" },
  { type: "text", label: "Text", icon: Type, description: "Plain text content" },
];

// Style Templates
const STYLE_TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    config: { fgColor: "#000000", bgColor: "#FFFFFF", level: "M" as const },
  },
  {
    id: "rounded",
    name: "Rounded",
    config: { fgColor: "#1a1a1a", bgColor: "#FFFFFF", level: "H" as const },
  },
  {
    id: "blue",
    name: "Ocean Blue",
    config: { fgColor: "#2563eb", bgColor: "#FFFFFF", level: "M" as const },
  },
  {
    id: "purple",
    name: "Royal Purple",
    config: { fgColor: "#7c3aed", bgColor: "#FFFFFF", level: "M" as const },
  },
  {
    id: "gradient",
    name: "Sunset",
    config: { fgColor: "#ec4899", bgColor: "#fdf2f8", level: "M" as const },
  },
  {
    id: "dark",
    name: "Dark Mode",
    config: { fgColor: "#FFFFFF", bgColor: "#1f2937", level: "M" as const },
  },
];

// Frame Styles
const FRAME_STYLES = [
  { id: "none", name: "No Frame" },
  { id: "bottom", name: "Bottom Text" },
  { id: "top", name: "Top Text" },
  { id: "rounded", name: "Rounded Border" },
];

// Mock QR codes data
const mockQRCodes = [
  {
    id: "1",
    name: "Restaurant Menu",
    type: "url",
    content: "https://restaurant.com/menu",
    scanCount: 523,
    createdAt: "2024-01-10",
    style: { fgColor: "#000000", bgColor: "#FFFFFF" },
  },
  {
    id: "2",
    name: "Business Card",
    type: "vcard",
    content: "BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nEND:VCARD",
    scanCount: 156,
    createdAt: "2024-01-08",
    style: { fgColor: "#2563eb", bgColor: "#FFFFFF" },
  },
  {
    id: "3",
    name: "Office WiFi",
    type: "wifi",
    content: "WIFI:T:WPA;S:OfficeNet;P:secret123;;",
    scanCount: 892,
    createdAt: "2024-01-05",
    style: { fgColor: "#7c3aed", bgColor: "#FFFFFF" },
  },
];

interface QRFormData {
  type: string;
  // URL
  url: string;
  // vCard
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  // WiFi
  ssid: string;
  password: string;
  encryption: string;
  // SMS
  smsPhone: string;
  smsMessage: string;
  // Email
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  // Text
  text: string;
  // Style
  fgColor: string;
  bgColor: string;
  size: number;
  level: "L" | "M" | "Q" | "H";
  // Logo
  logo: string;
  logoSize: number;
  // Frame
  frameStyle: string;
  frameText: string;
  frameColor: string;
  // Meta
  name: string;
}

const defaultFormData: QRFormData = {
  type: "url",
  url: "",
  firstName: "",
  lastName: "",
  organization: "",
  title: "",
  email: "",
  phone: "",
  website: "",
  ssid: "",
  password: "",
  encryption: "WPA",
  smsPhone: "",
  smsMessage: "",
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  text: "",
  fgColor: "#000000",
  bgColor: "#FFFFFF",
  size: 256,
  level: "M",
  logo: "",
  logoSize: 40,
  frameStyle: "none",
  frameText: "Scan Me",
  frameColor: "#000000",
  name: "",
};

export default function QRCodesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<QRFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState("content");
  const [qrCodes, setQRCodes] = useState(mockQRCodes);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR content based on type
  const generateContent = useCallback((): string => {
    switch (formData.type) {
      case "url":
        return formData.url || "https://example.com";
      case "vcard":
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${formData.lastName};${formData.firstName};;;`,
          `FN:${formData.firstName} ${formData.lastName}`,
          formData.organization && `ORG:${formData.organization}`,
          formData.title && `TITLE:${formData.title}`,
          formData.email && `EMAIL:${formData.email}`,
          formData.phone && `TEL:${formData.phone}`,
          formData.website && `URL:${formData.website}`,
          "END:VCARD",
        ]
          .filter(Boolean)
          .join("\n");
      case "wifi":
        return `WIFI:T:${formData.encryption};S:${formData.ssid};P:${formData.password};;`;
      case "sms":
        return formData.smsMessage
          ? `SMSTO:${formData.smsPhone}:${formData.smsMessage}`
          : `SMSTO:${formData.smsPhone}`;
      case "email":
        const params = [];
        if (formData.emailSubject) params.push(`subject=${encodeURIComponent(formData.emailSubject)}`);
        if (formData.emailBody) params.push(`body=${encodeURIComponent(formData.emailBody)}`);
        return `mailto:${formData.emailTo}${params.length ? "?" + params.join("&") : ""}`;
      case "text":
        return formData.text || "Hello World";
      default:
        return "";
    }
  }, [formData]);

  // Apply template
  const applyTemplate = (template: (typeof STYLE_TEMPLATES)[0]) => {
    setFormData((prev) => ({
      ...prev,
      fgColor: template.config.fgColor,
      bgColor: template.config.bgColor,
      level: template.config.level,
    }));
  };

  // Download QR code
  const downloadQR = (format: "png" | "svg") => {
    const canvas = qrRef.current?.querySelector("canvas");
    const svg = qrRef.current?.querySelector("svg");

    if (format === "png" && canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${formData.name || "qrcode"}.png`;
      link.href = url;
      link.click();
    } else if (format === "svg" && svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${formData.name || "qrcode"}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Copy QR to clipboard
  const copyToClipboard = async () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      try {
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/png")
        );
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  // Save QR code
  const handleSave = () => {
    const newQR = {
      id: Date.now().toString(),
      name: formData.name || `QR Code ${new Date().toLocaleDateString()}`,
      type: formData.type,
      content: generateContent(),
      scanCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      style: { fgColor: formData.fgColor, bgColor: formData.bgColor },
    };
    setQRCodes([newQR, ...qrCodes]);
    setShowCreateDialog(false);
    setFormData(defaultFormData);
  };

  // Filter QR codes
  const filteredQRCodes = qrCodes.filter(
    (qr) =>
      qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Content form based on type
  const renderContentForm = () => {
    switch (formData.type) {
      case "url":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>
        );

      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  placeholder="Company Inc."
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="Software Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>
        );

      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ssid">Network Name (SSID) *</Label>
              <Input
                id="ssid"
                placeholder="MyWiFiNetwork"
                value={formData.ssid}
                onChange={(e) => setFormData({ ...formData, ssid: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="encryption">Security Type</Label>
              <Select
                id="encryption"
                value={formData.encryption}
                onChange={(e) => setFormData({ ...formData, encryption: e.target.value })}
                className="mt-1.5"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </Select>
            </div>
          </div>
        );

      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="smsPhone">Phone Number *</Label>
              <Input
                id="smsPhone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.smsPhone}
                onChange={(e) => setFormData({ ...formData, smsPhone: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="smsMessage">Message (optional)</Label>
              <textarea
                id="smsMessage"
                placeholder="Your pre-filled message..."
                value={formData.smsMessage}
                onChange={(e) => setFormData({ ...formData, smsMessage: e.target.value })}
                className="mt-1.5 w-full h-24 rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="emailTo">Email Address *</Label>
              <Input
                id="emailTo"
                type="email"
                placeholder="recipient@example.com"
                value={formData.emailTo}
                onChange={(e) => setFormData({ ...formData, emailTo: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="emailSubject">Subject (optional)</Label>
              <Input
                id="emailSubject"
                placeholder="Email subject..."
                value={formData.emailSubject}
                onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="emailBody">Body (optional)</Label>
              <textarea
                id="emailBody"
                placeholder="Email body content..."
                value={formData.emailBody}
                onChange={(e) => setFormData({ ...formData, emailBody: e.target.value })}
                className="mt-1.5 w-full h-24 rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text Content</Label>
              <textarea
                id="text"
                placeholder="Enter any text content..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="mt-1.5 w-full h-32 rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AppHeader title="QR Codes" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <Input
              placeholder="Search QR codes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Create QR Code
          </Button>
        </div>

        {/* QR Codes Grid */}
        {filteredQRCodes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQRCodes.map((qr) => (
              <Card key={qr.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="pt-6">
                  {/* QR Code Preview */}
                  <div
                    className="rounded-lg p-4 mb-4 flex items-center justify-center"
                    style={{ backgroundColor: qr.style.bgColor }}
                  >
                    <QRCodeSVG
                      value={qr.content}
                      size={128}
                      fgColor={qr.style.fgColor}
                      bgColor={qr.style.bgColor}
                      level="M"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[var(--dark)] truncate">{qr.name}</h3>
                      <Badge variant="outline" className="uppercase text-xs">
                        {qr.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                      <span>{qr.scanCount} scans</span>
                      <span>{qr.createdAt}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
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
              <QrCode className="h-16 w-16 mx-auto text-[var(--muted)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">No QR Codes Yet</h3>
              <p className="text-[var(--muted)] mb-6">
                Create your first QR code to get started
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4" />
                Create QR Code
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create QR Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create QR Code</DialogTitle>
            <DialogDescription>
              Generate a customized QR code for any purpose
            </DialogDescription>
          </DialogHeader>

          <div className="grid lg:grid-cols-2 gap-6 mt-4">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* QR Name */}
              <div>
                <Label htmlFor="qrName">QR Code Name</Label>
                <Input
                  id="qrName"
                  placeholder="My QR Code"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              {/* QR Type Selector */}
              <div>
                <Label>QR Code Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {QR_TYPES.map((qrType) => (
                    <button
                      key={qrType.type}
                      onClick={() => setFormData({ ...formData, type: qrType.type })}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                        formData.type === qrType.type
                          ? "border-[var(--primary)] bg-[var(--primary)]/5"
                          : "border-[var(--border)] hover:border-[var(--primary)]/50"
                      )}
                    >
                      <qrType.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{qrType.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs for Content/Style/Frame */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="content" className="flex-1">
                    <Type className="h-4 w-4 mr-1.5" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="style" className="flex-1">
                    <Palette className="h-4 w-4 mr-1.5" />
                    Style
                  </TabsTrigger>
                  <TabsTrigger value="frame" className="flex-1">
                    <Frame className="h-4 w-4 mr-1.5" />
                    Frame
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-4">
                  {renderContentForm()}
                </TabsContent>

                <TabsContent value="style" className="mt-4 space-y-6">
                  {/* Templates */}
                  <div>
                    <Label>Quick Templates</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {STYLE_TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => applyTemplate(template)}
                          className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-all"
                          style={{ backgroundColor: template.config.bgColor }}
                        >
                          <div
                            className="w-full h-8 rounded"
                            style={{ backgroundColor: template.config.fgColor }}
                          />
                          <span className="text-xs font-medium mt-1 block">{template.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fgColor">Foreground Color</Label>
                      <div className="flex gap-2 mt-1.5">
                        <input
                          type="color"
                          id="fgColor"
                          value={formData.fgColor}
                          onChange={(e) => setFormData({ ...formData, fgColor: e.target.value })}
                          className="w-12 h-10 rounded cursor-pointer border border-[var(--border)]"
                        />
                        <Input
                          value={formData.fgColor}
                          onChange={(e) => setFormData({ ...formData, fgColor: e.target.value })}
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bgColor">Background Color</Label>
                      <div className="flex gap-2 mt-1.5">
                        <input
                          type="color"
                          id="bgColor"
                          value={formData.bgColor}
                          onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                          className="w-12 h-10 rounded cursor-pointer border border-[var(--border)]"
                        />
                        <Input
                          value={formData.bgColor}
                          onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div>
                    <Label htmlFor="errorLevel">Error Correction Level</Label>
                    <Select
                      id="errorLevel"
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value as "L" | "M" | "Q" | "H" })
                      }
                      className="mt-1.5"
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </Select>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Higher correction allows more of the QR code to be damaged/covered
                    </p>
                  </div>

                  {/* Size */}
                  <div>
                    <Label htmlFor="size">Size (pixels)</Label>
                    <Input
                      id="size"
                      type="number"
                      min="128"
                      max="1024"
                      step="32"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: parseInt(e.target.value) || 256 })
                      }
                      className="mt-1.5"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="frame" className="mt-4 space-y-6">
                  {/* Frame Style */}
                  <div>
                    <Label>Frame Style</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {FRAME_STYLES.map((frame) => (
                        <button
                          key={frame.id}
                          onClick={() => setFormData({ ...formData, frameStyle: frame.id })}
                          className={cn(
                            "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                            formData.frameStyle === frame.id
                              ? "border-[var(--primary)] bg-[var(--primary)]/5"
                              : "border-[var(--border)] hover:border-[var(--primary)]/50"
                          )}
                        >
                          {frame.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.frameStyle !== "none" && (
                    <>
                      {/* Frame Text */}
                      <div>
                        <Label htmlFor="frameText">Frame Text</Label>
                        <Input
                          id="frameText"
                          placeholder="Scan Me"
                          value={formData.frameText}
                          onChange={(e) => setFormData({ ...formData, frameText: e.target.value })}
                          className="mt-1.5"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["Scan Me", "Scan to Connect", "Scan for Menu", "Scan to Pay"].map(
                            (preset) => (
                              <button
                                key={preset}
                                onClick={() => setFormData({ ...formData, frameText: preset })}
                                className="px-2 py-1 text-xs rounded border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                              >
                                {preset}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Frame Color */}
                      <div>
                        <Label htmlFor="frameColor">Frame Color</Label>
                        <div className="flex gap-2 mt-1.5">
                          <input
                            type="color"
                            id="frameColor"
                            value={formData.frameColor}
                            onChange={(e) =>
                              setFormData({ ...formData, frameColor: e.target.value })
                            }
                            className="w-12 h-10 rounded cursor-pointer border border-[var(--border)]"
                          />
                          <Input
                            value={formData.frameColor}
                            onChange={(e) =>
                              setFormData({ ...formData, frameColor: e.target.value })
                            }
                            className="flex-1 font-mono"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: Preview */}
            <div className="lg:border-l lg:pl-6 border-[var(--border)]">
              <Label className="mb-4 block">Live Preview</Label>
              <div
                ref={qrRef}
                className="rounded-xl p-8 flex flex-col items-center justify-center"
                style={{ backgroundColor: formData.bgColor }}
              >
                {/* Frame Top Text */}
                {formData.frameStyle === "top" && (
                  <div
                    className="mb-3 px-4 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: formData.frameColor, color: formData.bgColor }}
                  >
                    {formData.frameText}
                  </div>
                )}

                {/* QR Code */}
                <div
                  className={cn(
                    "p-4",
                    formData.frameStyle === "rounded" && "border-4 rounded-2xl",
                  )}
                  style={{
                    borderColor: formData.frameStyle === "rounded" ? formData.frameColor : undefined,
                  }}
                >
                  <QRCodeCanvas
                    value={generateContent()}
                    size={formData.size > 300 ? 256 : formData.size}
                    fgColor={formData.fgColor}
                    bgColor={formData.bgColor}
                    level={formData.level}
                    imageSettings={
                      formData.logo
                        ? {
                            src: formData.logo,
                            height: formData.logoSize,
                            width: formData.logoSize,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                {/* Frame Bottom Text */}
                {formData.frameStyle === "bottom" && (
                  <div
                    className="mt-3 px-4 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: formData.frameColor, color: formData.bgColor }}
                  >
                    {formData.frameText}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => downloadQR("png")}>
                  <Download className="h-4 w-4" />
                  PNG
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => downloadQR("svg")}>
                  <Download className="h-4 w-4" />
                  SVG
                </Button>
                <Button variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save QR Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
