"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";
import { Button } from "./button";

interface VideoModalProps {
  // YouTube video ID (e.g., "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ)
  youtubeId?: string;
  // Or local video path (e.g., "/videos/demo.mp4")
  videoSrc?: string;
  // Button text
  buttonText?: string;
  // Button variant
  variant?: "default" | "outline" | "secondary" | "ghost";
  // Button size
  size?: "default" | "sm" | "lg";
  // Optional className for button
  className?: string;
}

export function VideoModal({
  youtubeId,
  videoSrc,
  buttonText = "Watch Demo",
  variant = "outline",
  size = "lg",
  className,
}: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant={variant}
        size={size}
        onClick={openModal}
        className={className}
      >
        <Play className="h-5 w-5 mr-2" />
        {buttonText}
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div
            className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Video Content */}
            {youtubeId ? (
              // YouTube Embed
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title="Demo Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoSrc ? (
              // Local Video
              <video
                src={videoSrc}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              // Placeholder when no video is set
              <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <Play className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg opacity-70">Video coming soon...</p>
                <p className="text-sm opacity-50 mt-2">
                  Add youtubeId or videoSrc prop to display video
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
