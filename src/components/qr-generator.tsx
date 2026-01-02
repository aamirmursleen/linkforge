"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, Loader2, RefreshCw } from "lucide-react";

interface GeneratedQR {
  url: string;
  shortUrl?: string;
  shortCode?: string;
}

export function QRGenerator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQR, setGeneratedQR] = useState<GeneratedQR | null>(null);
  const [copied, setCopied] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Add https:// if no protocol specified
    let urlToUse = url.trim();
    if (!urlToUse.startsWith("http://") && !urlToUse.startsWith("https://")) {
      urlToUse = "https://" + urlToUse;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a short link for tracking
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl: urlToUse, title: "QR Code Link" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create link");
      }

      setGeneratedQR({
        url: urlToUse,
        shortUrl: data.data.shortUrl,
        shortCode: data.data.shortCode,
      });
      setUrl("");
    } catch (err) {
      // Even if API fails, generate QR with original URL
      setGeneratedQR({ url: urlToUse });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format: "png" | "svg") => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-code-${generatedQR?.shortCode || "linkforge"}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = 400;
        canvas.height = 400;
        ctx?.drawImage(img, 0, 0, 400, 400);

        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `qr-code-${generatedQR?.shortCode || "linkforge"}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  };

  const handleCopy = async () => {
    if (!generatedQR?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(generatedQR.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = generatedQR.shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleGenerate();
    }
  };

  const qrUrl = generatedQR?.shortUrl || generatedQR?.url || "";

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-[var(--border)] p-8">
      {!generatedQR ? (
        <div className="space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--dark)]">
              Enter URL
            </label>
            <input
              type="text"
              placeholder="https://example.com/your-page"
              className="w-full p-3 border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          {/* Color Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--dark)]">
                QR Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-[var(--border)]"
                />
                <span className="text-sm text-[var(--muted)]">{fgColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--dark)]">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-[var(--border)]"
                />
                <span className="text-sm text-[var(--muted)]">{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Generate Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* QR Code Display */}
          <div
            ref={qrRef}
            className="flex justify-center p-4 rounded-xl"
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeSVG
              value={qrUrl}
              size={200}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Short URL */}
          {generatedQR.shortUrl && (
            <div className="text-center">
              <p className="text-sm text-[var(--muted)]">Trackable URL</p>
              <p className="text-lg font-medium text-[var(--primary)]">
                {generatedQR.shortUrl}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => handleDownload("png")}>
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
            <Button variant="secondary" onClick={() => handleDownload("svg")}>
              <Download className="h-4 w-4 mr-2" />
              SVG
            </Button>
          </div>

          {generatedQR.shortUrl && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setGeneratedQR(null)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Create Another
          </Button>
        </div>
      )}
    </div>
  );
}
