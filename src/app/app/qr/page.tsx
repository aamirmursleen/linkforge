"use client";

import { useState, useRef, useCallback } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Sparkles,
  Scan,
} from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
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

// QR Types Configuration
const QR_TYPES = [
  { type: "url", label: "URL", icon: Link2, description: "Link to any website", color: "bg-violet-500" },
  { type: "vcard", label: "Contact", icon: User, description: "Share contact info", color: "bg-emerald-500" },
  { type: "wifi", label: "WiFi", icon: Wifi, description: "Share WiFi credentials", color: "bg-cyan-500" },
  { type: "sms", label: "SMS", icon: MessageSquare, description: "Pre-filled message", color: "bg-amber-500" },
  { type: "email", label: "Email", icon: Mail, description: "Pre-filled email", color: "bg-rose-500" },
  { type: "text", label: "Text", icon: Type, description: "Plain text content", color: "bg-blue-500" },
];

// Style Templates
const STYLE_TEMPLATES = [
  { id: "classic", name: "Classic", config: { fgColor: "#000000", bgColor: "#FFFFFF", level: "M" as const } },
  { id: "rounded", name: "Rounded", config: { fgColor: "#1a1a1a", bgColor: "#FFFFFF", level: "H" as const } },
  { id: "blue", name: "Ocean Blue", config: { fgColor: "#2563eb", bgColor: "#FFFFFF", level: "M" as const } },
  { id: "purple", name: "Royal Purple", config: { fgColor: "#7c3aed", bgColor: "#FFFFFF", level: "M" as const } },
  { id: "gradient", name: "Sunset", config: { fgColor: "#ec4899", bgColor: "#fdf2f8", level: "M" as const } },
  { id: "dark", name: "Dark Mode", config: { fgColor: "#FFFFFF", bgColor: "#1f2937", level: "M" as const } },
];

// Frame Styles
const FRAME_STYLES = [
  { id: "none", name: "No Frame" },
  { id: "bottom", name: "Bottom Text" },
  { id: "top", name: "Top Text" },
  { id: "rounded", name: "Rounded Border" },
];

interface QRCodeItem {
  id: string;
  name: string;
  type: string;
  content: string;
  scanCount: number;
  createdAt: string;
  style: { fgColor: string; bgColor: string };
}

interface QRFormData {
  type: string;
  url: string;
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  ssid: string;
  password: string;
  encryption: string;
  smsPhone: string;
  smsMessage: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  text: string;
  fgColor: string;
  bgColor: string;
  size: number;
  level: "L" | "M" | "Q" | "H";
  logo: string;
  logoSize: number;
  frameStyle: string;
  frameText: string;
  frameColor: string;
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
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

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
        ].filter(Boolean).join("\n");
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

  const applyTemplate = (template: (typeof STYLE_TEMPLATES)[0]) => {
    setFormData((prev) => ({
      ...prev,
      fgColor: template.config.fgColor,
      bgColor: template.config.bgColor,
      level: template.config.level,
    }));
  };

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

  const filteredQRCodes = qrCodes.filter(
    (qr) =>
      qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalScans = qrCodes.reduce((acc, qr) => acc + qr.scanCount, 0);

  const renderContentForm = () => {
    const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50";
    const labelClass = "text-sm font-medium text-gray-300";

    switch (formData.type) {
      case "url":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Website URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
          </div>
        );
      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`${inputClass} mt-1.5`}
                />
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`${inputClass} mt-1.5`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Organization</label>
                <input
                  placeholder="Company Inc."
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className={`${inputClass} mt-1.5`}
                />
              </div>
              <div>
                <label className={labelClass}>Job Title</label>
                <input
                  placeholder="Software Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`${inputClass} mt-1.5`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
          </div>
        );
      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Network Name (SSID) *</label>
              <input
                placeholder="MyWiFiNetwork"
                value={formData.ssid}
                onChange={(e) => setFormData({ ...formData, ssid: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelClass}>Security Type</label>
              <select
                value={formData.encryption}
                onChange={(e) => setFormData({ ...formData, encryption: e.target.value })}
                className={`${inputClass} mt-1.5`}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>
        );
      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Phone Number *</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.smsPhone}
                onChange={(e) => setFormData({ ...formData, smsPhone: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelClass}>Pre-filled Message (optional)</label>
              <textarea
                placeholder="Your message here..."
                value={formData.smsMessage}
                onChange={(e) => setFormData({ ...formData, smsMessage: e.target.value })}
                className={`${inputClass} mt-1.5 h-24`}
              />
            </div>
          </div>
        );
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email Address *</label>
              <input
                type="email"
                placeholder="recipient@example.com"
                value={formData.emailTo}
                onChange={(e) => setFormData({ ...formData, emailTo: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelClass}>Subject</label>
              <input
                placeholder="Email subject"
                value={formData.emailSubject}
                onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
                className={`${inputClass} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelClass}>Body</label>
              <textarea
                placeholder="Email body..."
                value={formData.emailBody}
                onChange={(e) => setFormData({ ...formData, emailBody: e.target.value })}
                className={`${inputClass} mt-1.5 h-24`}
              />
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Text Content</label>
              <textarea
                placeholder="Enter any text content..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className={`${inputClass} mt-1.5 h-32`}
              />
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
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader title="QR Codes" />

        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={QrCode} color="bg-violet-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{qrCodes.length}</div>
                  <div className="text-xs text-gray-400">Total QR Codes</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Scan} color="bg-emerald-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{totalScans.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Total Scans</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Link2} color="bg-cyan-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {qrCodes.filter(qr => qr.type === "url").length}
                  </div>
                  <div className="text-xs text-gray-400">URL Codes</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={User} color="bg-amber-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {qrCodes.filter(qr => qr.type === "vcard").length}
                  </div>
                  <div className="text-xs text-gray-400">Contact Cards</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search QR codes..."
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
              Create QR Code
            </button>
          </div>

          {/* QR Codes Grid */}
          {filteredQRCodes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredQRCodes.map((qr, index) => {
                const typeConfig = QR_TYPES.find(t => t.type === qr.type);
                const colors = ["bg-violet-500", "bg-emerald-500", "bg-cyan-500", "bg-amber-500", "bg-rose-500", "bg-blue-500"];
                const iconColor = typeConfig?.color || colors[index % colors.length];

                return (
                  <div
                    key={qr.id}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all group hover:shadow-lg hover:shadow-violet-500/10 overflow-hidden"
                  >
                    {/* QR Code Preview */}
                    <div
                      className="p-6 flex items-center justify-center"
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

                    <div className="p-4 space-y-3">
                      {/* Info */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white truncate">{qr.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${iconColor} bg-opacity-20 text-white uppercase`}>
                          {qr.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{qr.scanCount} scans</span>
                        <span>{qr.createdAt}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm transition-colors">
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                  <QrCode className="h-8 w-8 text-violet-400" />
                </div>
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">No QR Codes Yet</h3>
              <p className="text-gray-400 mb-6">Create your first QR code to get started</p>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all"
              >
                <Plus className="h-4 w-4" />
                Create QR Code
              </button>
            </div>
          )}
        </div>

        {/* Create QR Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1425] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Create QR Code</DialogTitle>
              <DialogDescription className="text-gray-400">
                Generate a customized QR code for any purpose
              </DialogDescription>
            </DialogHeader>

            <div className="grid lg:grid-cols-2 gap-6 mt-4">
              {/* Left: Form */}
              <div className="space-y-6">
                {/* QR Name */}
                <div>
                  <label className="text-sm font-medium text-gray-300">QR Code Name</label>
                  <input
                    placeholder="My QR Code"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>

                {/* QR Type Selector */}
                <div>
                  <label className="text-sm font-medium text-gray-300">QR Code Type</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {QR_TYPES.map((qrType) => (
                      <button
                        key={qrType.type}
                        onClick={() => setFormData({ ...formData, type: qrType.type })}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                          formData.type === qrType.type
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-white/10 hover:border-violet-500/50 bg-white/5"
                        )}
                      >
                        <qrType.icon className="h-5 w-5 text-gray-300" />
                        <span className="text-xs font-medium text-gray-300">{qrType.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tabs for Content/Style/Frame */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full bg-white/5 border border-white/10 rounded-xl p-1">
                    <TabsTrigger value="content" className="flex-1 data-[state=active]:bg-violet-500/20 data-[state=active]:text-white text-gray-400 rounded-lg">
                      <Type className="h-4 w-4 mr-1.5" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="style" className="flex-1 data-[state=active]:bg-violet-500/20 data-[state=active]:text-white text-gray-400 rounded-lg">
                      <Palette className="h-4 w-4 mr-1.5" />
                      Style
                    </TabsTrigger>
                    <TabsTrigger value="frame" className="flex-1 data-[state=active]:bg-violet-500/20 data-[state=active]:text-white text-gray-400 rounded-lg">
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
                      <label className="text-sm font-medium text-gray-300">Quick Templates</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {STYLE_TEMPLATES.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => applyTemplate(template)}
                            className="p-3 rounded-xl border border-white/10 hover:border-violet-500/50 transition-all"
                            style={{ backgroundColor: template.config.bgColor }}
                          >
                            <div
                              className="w-8 h-8 mx-auto rounded"
                              style={{ backgroundColor: template.config.fgColor }}
                            />
                            <span className="text-xs mt-2 block text-center" style={{ color: template.config.fgColor }}>
                              {template.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Foreground Color</label>
                        <div className="flex gap-2 mt-1.5">
                          <input
                            type="color"
                            value={formData.fgColor}
                            onChange={(e) => setFormData({ ...formData, fgColor: e.target.value })}
                            className="w-12 h-10 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.fgColor}
                            onChange={(e) => setFormData({ ...formData, fgColor: e.target.value })}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Background Color</label>
                        <div className="flex gap-2 mt-1.5">
                          <input
                            type="color"
                            value={formData.bgColor}
                            onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                            className="w-12 h-10 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.bgColor}
                            onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Error Correction */}
                    <div>
                      <label className="text-sm font-medium text-gray-300">Error Correction Level</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value as "L" | "M" | "Q" | "H" })}
                        className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      >
                        <option value="L">Low (7%)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                      </select>
                    </div>
                  </TabsContent>

                  <TabsContent value="frame" className="mt-4 space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Frame Style</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {FRAME_STYLES.map((frame) => (
                          <button
                            key={frame.id}
                            onClick={() => setFormData({ ...formData, frameStyle: frame.id })}
                            className={cn(
                              "p-3 rounded-xl border-2 transition-all text-sm",
                              formData.frameStyle === frame.id
                                ? "border-violet-500 bg-violet-500/10 text-white"
                                : "border-white/10 hover:border-violet-500/50 text-gray-300 bg-white/5"
                            )}
                          >
                            {frame.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.frameStyle !== "none" && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-300">Frame Text</label>
                          <input
                            placeholder="Scan Me"
                            value={formData.frameText}
                            onChange={(e) => setFormData({ ...formData, frameText: e.target.value })}
                            className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-300">Frame Color</label>
                          <div className="flex gap-2 mt-1.5">
                            <input
                              type="color"
                              value={formData.frameColor}
                              onChange={(e) => setFormData({ ...formData, frameColor: e.target.value })}
                              className="w-12 h-10 rounded-lg cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.frameColor}
                              onChange={(e) => setFormData({ ...formData, frameColor: e.target.value })}
                              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right: Preview */}
              <div className="lg:sticky lg:top-0">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Preview</h3>
                  <div
                    ref={qrRef}
                    className="rounded-xl p-8 flex items-center justify-center mb-4"
                    style={{ backgroundColor: formData.bgColor }}
                  >
                    <QRCodeCanvas
                      value={generateContent()}
                      size={formData.size}
                      fgColor={formData.fgColor}
                      bgColor={formData.bgColor}
                      level={formData.level}
                      includeMargin
                    />
                  </div>

                  {/* Download Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => downloadQR("png")}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      PNG
                    </button>
                    <button
                      onClick={() => downloadQR("svg")}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      SVG
                    </button>
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
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
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all"
              >
                Save QR Code
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
