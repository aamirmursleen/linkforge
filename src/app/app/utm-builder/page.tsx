"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import {
  Link2,
  Copy,
  Check,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  Tag,
  Target,
  Megaphone,
  Search,
  FileText,
  ExternalLink,
  Sparkles,
  Info,
  Zap,
  MousePointerClick,
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

interface UTMPreset {
  id: string;
  name: string;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
}

const UTM_PARAMS = [
  { key: "source", label: "utm_source", icon: Megaphone, description: "Identifies the advertiser, site, or publication", examples: ["google", "facebook", "twitter", "newsletter"], required: true, color: "bg-violet-500" },
  { key: "medium", label: "utm_medium", icon: Target, description: "Marketing medium (cpc, email, social, etc.)", examples: ["cpc", "email", "social", "banner"], required: true, color: "bg-emerald-500" },
  { key: "campaign", label: "utm_campaign", icon: Tag, description: "Product, promo code, or campaign name", examples: ["spring_sale", "product_launch"], required: true, color: "bg-cyan-500" },
  { key: "term", label: "utm_term", icon: Search, description: "Paid search keywords", examples: ["running+shoes", "discount+code"], required: false, color: "bg-amber-500" },
  { key: "content", label: "utm_content", icon: FileText, description: "Differentiate similar content or links", examples: ["logolink", "textlink", "cta_button"], required: false, color: "bg-rose-500" },
];

export default function UTMBuilderPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [utmParams, setUtmParams] = useState({ source: "", medium: "", campaign: "", term: "", content: "" });
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [presets, setPresets] = useState<UTMPreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showSavePreset, setShowSavePreset] = useState(false);

  useEffect(() => {
    if (!baseUrl) { setGeneratedUrl(""); return; }
    try {
      const url = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`);
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) url.searchParams.set(`utm_${key}`, value);
      });
      setGeneratedUrl(url.toString());
    } catch { setGeneratedUrl(""); }
  }, [baseUrl, utmParams]);

  const copyToClipboard = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyPreset = (preset: UTMPreset) => {
    setUtmParams({
      source: preset.source || "",
      medium: preset.medium || "",
      campaign: preset.campaign || "",
      term: preset.term || "",
      content: preset.content || "",
    });
  };

  const savePreset = () => {
    if (!presetName) return;
    const newPreset: UTMPreset = { id: Date.now().toString(), name: presetName, ...utmParams };
    setPresets([...presets, newPreset]);
    setPresetName("");
    setShowSavePreset(false);
  };

  const clearAll = () => {
    setBaseUrl("");
    setUtmParams({ source: "", medium: "", campaign: "", term: "", content: "" });
  };

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50";

  return (
    <div className="min-h-screen bg-[#0f0a1f]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader title="UTM Builder" />

        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Tag} color="bg-violet-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{presets.length}</div>
                  <div className="text-xs text-gray-400">Saved Presets</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Link2} color="bg-emerald-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{generatedUrl ? 1 : 0}</div>
                  <div className="text-xs text-gray-400">URL Ready</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Zap} color="bg-cyan-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{Object.values(utmParams).filter(v => v).length}</div>
                  <div className="text-xs text-gray-400">Params Set</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={MousePointerClick} color="bg-amber-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-xs text-gray-400">Links Created</div>
                </div>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-white">Campaign URL Builder</h2>
              <p className="text-sm text-gray-400 mt-1">Add UTM parameters to track your marketing campaigns</p>
            </div>
            <div className="flex gap-2">
              <button onClick={clearAll} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors">Clear All</button>
              <button onClick={() => setShowSavePreset(!showSavePreset)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors">
                <Save className="h-4 w-4" />Save Preset
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Builder Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Base URL */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="h-5 w-5 text-violet-400" />
                  <h3 className="font-semibold text-white">Base URL</h3>
                  <span className="text-xs text-red-400">*required</span>
                </div>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com/landing-page"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-2">Enter the URL you want to track</p>
              </div>

              {/* UTM Parameters */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="h-5 w-5 text-violet-400" />
                  <h3 className="font-semibold text-white">UTM Parameters</h3>
                </div>
                <div className="space-y-4">
                  {UTM_PARAMS.map((param) => (
                    <div key={param.key} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-8 w-8 rounded-lg ${param.color} bg-opacity-20 flex items-center justify-center`}>
                          <param.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-white">{param.label}</span>
                          {param.required && <span className="text-xs text-red-400 ml-2">*</span>}
                        </div>
                      </div>
                      <input
                        value={utmParams[param.key as keyof typeof utmParams]}
                        onChange={(e) => setUtmParams({ ...utmParams, [param.key]: e.target.value })}
                        placeholder={param.examples.join(", ")}
                        className={inputClass}
                      />
                      <p className="text-xs text-gray-500 mt-2">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview & Presets */}
            <div className="space-y-6">
              {/* Generated URL */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <h3 className="font-semibold text-white">Generated URL</h3>
                </div>
                {generatedUrl ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl break-all text-sm text-gray-300">{generatedUrl}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => window.open(`/app/links?url=${encodeURIComponent(generatedUrl)}`, "_self")}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Shorten
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Link2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Enter a base URL to generate your tracking link</p>
                  </div>
                )}
              </div>

              {/* Save Preset Form */}
              {showSavePreset && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-violet-500/50 p-6">
                  <h3 className="font-semibold text-white mb-4">Save as Preset</h3>
                  <input
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset name"
                    className={`${inputClass} mb-3`}
                  />
                  <button
                    onClick={savePreset}
                    disabled={!presetName}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all"
                  >
                    Save Preset
                  </button>
                </div>
              )}

              {/* Presets */}
              {presets.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h3 className="font-semibold text-white mb-4">Saved Presets</h3>
                  <div className="space-y-2">
                    {presets.map((preset) => (
                      <div key={preset.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <button onClick={() => applyPreset(preset)} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">{preset.name}</button>
                        <button onClick={() => setPresets(presets.filter((p) => p.id !== preset.id))} className="p-1 hover:bg-white/10 rounded text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
