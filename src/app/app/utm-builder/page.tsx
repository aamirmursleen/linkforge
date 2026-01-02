"use client";

import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  {
    key: "source",
    label: "utm_source",
    icon: Megaphone,
    description: "Identifies the advertiser, site, or publication",
    examples: ["google", "facebook", "twitter", "newsletter", "linkedin"],
    required: true,
  },
  {
    key: "medium",
    label: "utm_medium",
    icon: Target,
    description: "Marketing medium (cpc, email, social, etc.)",
    examples: ["cpc", "email", "social", "banner", "affiliate"],
    required: true,
  },
  {
    key: "campaign",
    label: "utm_campaign",
    icon: Tag,
    description: "Product, promo code, or campaign name",
    examples: ["spring_sale", "product_launch", "brand_awareness"],
    required: true,
  },
  {
    key: "term",
    label: "utm_term",
    icon: Search,
    description: "Paid search keywords",
    examples: ["running+shoes", "discount+code"],
    required: false,
  },
  {
    key: "content",
    label: "utm_content",
    icon: FileText,
    description: "Differentiate similar content or links",
    examples: ["logolink", "textlink", "cta_button"],
    required: false,
  },
];

export default function UTMBuilderPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [utmParams, setUtmParams] = useState({
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  });
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [presets, setPresets] = useState<UTMPreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showSavePreset, setShowSavePreset] = useState(false);

  // Generate URL whenever params change
  useEffect(() => {
    if (!baseUrl) {
      setGeneratedUrl("");
      return;
    }

    try {
      const url = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`);

      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(`utm_${key}`, value);
        }
      });

      setGeneratedUrl(url.toString());
    } catch {
      setGeneratedUrl("");
    }
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

    const newPreset: UTMPreset = {
      id: Date.now().toString(),
      name: presetName,
      ...utmParams,
    };
    setPresets([...presets, newPreset]);
    setPresetName("");
    setShowSavePreset(false);
  };

  const deletePreset = (id: string) => {
    setPresets(presets.filter((p) => p.id !== id));
  };

  const clearAll = () => {
    setBaseUrl("");
    setUtmParams({ source: "", medium: "", campaign: "", term: "", content: "" });
  };

  const createShortLink = () => {
    if (generatedUrl) {
      // Navigate to links page with the URL pre-filled
      window.location.href = `/app/links?url=${encodeURIComponent(generatedUrl)}`;
    }
  };

  return (
    <>
      <AppHeader title="UTM Builder" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-[var(--dark)]">
              Campaign URL Builder
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              Add UTM parameters to track your marketing campaigns
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSavePreset(!showSavePreset)}
            >
              <Save className="h-4 w-4" />
              Save Preset
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Builder Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Base URL */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-[var(--primary)]" />
                  Destination URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="baseUrl" className="text-sm text-[var(--muted)]">
                    Enter the URL you want to track
                  </Label>
                  <Input
                    id="baseUrl"
                    type="url"
                    placeholder="https://example.com/landing-page"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="mt-2 h-12 text-base"
                  />
                </div>
              </CardContent>
            </Card>

            {/* UTM Parameters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">UTM Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {UTM_PARAMS.map((param) => (
                  <div key={param.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={param.key}
                        className="flex items-center gap-2"
                      >
                        <param.icon className="h-4 w-4 text-[var(--primary)]" />
                        <span className="font-mono text-sm">{param.label}</span>
                        {param.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </Label>
                      <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {param.description}
                      </span>
                    </div>
                    <Input
                      id={param.key}
                      placeholder={`e.g., ${param.examples[0]}`}
                      value={utmParams[param.key as keyof typeof utmParams]}
                      onChange={(e) =>
                        setUtmParams({ ...utmParams, [param.key]: e.target.value })
                      }
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {param.examples.map((example) => (
                        <button
                          key={example}
                          onClick={() =>
                            setUtmParams({ ...utmParams, [param.key]: example })
                          }
                          className="px-2 py-0.5 text-xs rounded-full bg-[var(--border)] hover:bg-[var(--primary-pale)] hover:text-[var(--primary)] transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Generated URL */}
            <Card className={cn(generatedUrl && "border-[var(--primary)]")}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  Generated URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedUrl ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--border)]/30 rounded-lg break-all font-mono text-sm">
                      {generatedUrl}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={copyToClipboard}>
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy URL
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={createShortLink}>
                        <Link2 className="h-4 w-4" />
                        Create Short Link
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(generatedUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[var(--muted)]">
                    <Link2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Enter a URL and UTM parameters to generate your tracking link</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Presets */}
          <div className="space-y-6">
            {/* Save Preset Form */}
            {showSavePreset && (
              <Card className="border-[var(--primary)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Save as Preset</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="presetName">Preset Name</Label>
                    <Input
                      id="presetName"
                      placeholder="e.g., Facebook Ads"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowSavePreset(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={savePreset} className="flex-1">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Presets */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Presets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  {
                    name: "Google Ads",
                    source: "google",
                    medium: "cpc",
                    campaign: "",
                  },
                  {
                    name: "Facebook Ads",
                    source: "facebook",
                    medium: "paid_social",
                    campaign: "",
                  },
                  {
                    name: "Email Campaign",
                    source: "newsletter",
                    medium: "email",
                    campaign: "",
                  },
                  {
                    name: "Twitter",
                    source: "twitter",
                    medium: "social",
                    campaign: "",
                  },
                  {
                    name: "LinkedIn",
                    source: "linkedin",
                    medium: "social",
                    campaign: "",
                  },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() =>
                      setUtmParams({
                        source: preset.source,
                        medium: preset.medium,
                        campaign: preset.campaign,
                        term: "",
                        content: "",
                      })
                    }
                    className="w-full p-3 text-left rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-pale)]/30 transition-all"
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">
                      {preset.source} / {preset.medium}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Saved Presets */}
            {presets.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Saved Presets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-all group"
                    >
                      <button
                        onClick={() => applyPreset(preset)}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium text-sm">{preset.name}</div>
                        <div className="text-xs text-[var(--muted)] mt-0.5">
                          {[preset.source, preset.medium, preset.campaign]
                            .filter(Boolean)
                            .join(" / ")}
                        </div>
                      </button>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">UTM Parameters Tips:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>Use lowercase for consistency</li>
                      <li>Avoid spaces (use underscores)</li>
                      <li>Keep campaign names descriptive</li>
                      <li>Be consistent across campaigns</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
