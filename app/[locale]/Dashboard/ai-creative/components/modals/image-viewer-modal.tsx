"use client"

import { useEffect, useState, useCallback } from "react"
import { X, ArrowLeft, ArrowRight, Clock, ImageIcon as ImageIconLucide, Info, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { DownloadModal } from "./download-modal"

interface ImageViewerModalProps {
  image: string
  imageIndex: number
  images: string[]
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  originalPrompt: string
  createdAt?: Date
  isReel?: boolean
  productUrl?: string
  onDownloadFile: (url: string, filename: string) => void
  imageId: string // Added imageId
}

export function ImageViewerModal({
  image,
  imageIndex,
  images,
  onClose,
  onNext,
  onPrevious,
  originalPrompt,
  createdAt,
  isReel,
  productUrl,
  onDownloadFile,
  imageId, // Destructure imageId
}: ImageViewerModalProps) {
  const t = useTranslations("creativeAi")
  const hasNext = onNext ? imageIndex < images.length - 1 : false
  const hasPrevious = onPrevious ? imageIndex > 0 : false
  const [isPromptTooltipVisible, setIsPromptTooltipVisible] = useState(false)
  const [isProductImageTooltipVisible, setIsProductImageTooltipVisible] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
      if (e.key === "ArrowRight" && hasNext && onNext) {
        onNext()
      }
      if (e.key === "ArrowLeft" && hasPrevious && onPrevious) {
        onPrevious()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious])

  const formattedCreationDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  const isVideoUrl = (url: string) => {
    if (!url) return false
    const lowerUrl = url.toLowerCase()
    return lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".webm") || lowerUrl.endsWith(".ogg")
  }

  const currentIsVideo = isReel || isVideoUrl(image)

  const handleDownloadClick = useCallback(() => {
    let extension = currentIsVideo ? ".mp4" : ".png"
    if (image.includes(".svg")) extension = ".svg"
    else if (image.includes(".jpg") || image.includes(".jpeg")) extension = ".jpg"

    const filename = `${currentIsVideo ? "reel" : "image"}_view_${Date.now()}${extension}`
    onDownloadFile(image, filename)
  }, [image, currentIsVideo, onDownloadFile])

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] text-white hover:bg-white/20 h-10 w-10 p-0"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Navigation Buttons */}
        {hasPrevious && onPrevious && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[60] text-white hover:bg-white/20 h-12 w-12 p-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        {hasNext && onNext && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[60] text-white hover:bg-white/20 h-12 w-12 p-0"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        )}

        {/* Top Info: Counter, Date, Download */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-[60]">
          <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {imageIndex + 1} of {images.length}
          </div>
          {formattedCreationDate && (
            <div className="bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formattedCreationDate}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDownloadModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {t("download")}
          </Button>
        </div>

        {/* Main Image/Video */}
        <div className="relative max-w-full max-h-[calc(100%-120px)]">
          {currentIsVideo ? (
            <video
              key={image}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            >
              <source src={image} type={image.endsWith(".webm") ? "video/webm" : "video/mp4"} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={image || "/placeholder.svg?height=600&width=800&text=Generated+Output"}
              alt={`Generated creative ${imageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          )}
        </div>

        {/* Bottom Info Bar: Product Image (if any) & Prompt */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-auto max-w-[calc(100%-80px)] z-50">
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 shadow-xl">
            {productUrl && (
              <div
                className="relative group"
                onMouseEnter={() => setIsProductImageTooltipVisible(true)}
                onMouseLeave={() => setIsProductImageTooltipVisible(false)}
              >
                <img
                  src={productUrl || "/placeholder.svg?height=40&width=40&text=Original"}
                  alt="Original product"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md border-2 border-white/30 transition-transform group-hover:scale-110"
                />
                {isProductImageTooltipVisible && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-1 bg-black/80 rounded-lg shadow-2xl w-48 h-48 sm:w-64 sm:h-64 z-[70]">
                    <img
                      src={productUrl || "/placeholder.svg"}
                      alt="Original product preview"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                )}
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                  <ImageIconLucide className="h-2.5 w-2.5" />
                </div>
              </div>
            )}
            <div
              className="relative group flex-1 min-w-0"
              onMouseEnter={() => setIsPromptTooltipVisible(true)}
              onMouseLeave={() => setIsPromptTooltipVisible(false)}
            >
              <p className="text-xs sm:text-sm text-slate-200 truncate cursor-default">{originalPrompt}</p>
              {isPromptTooltipVisible && (
                <div
                  className={cn(
                    "absolute bottom-full left-0 mb-2 p-3 bg-black/80 text-slate-100 rounded-lg shadow-2xl",
                    "max-w-md w-max text-xs sm:text-sm z-[70]",
                    "max-h-48 overflow-y-auto",
                  )}
                >
                  <p className="whitespace-pre-wrap">{originalPrompt}</p>
                </div>
              )}
              {!productUrl && (
                <div className="absolute -top-0.5 -left-0.5 bg-primary text-primary-foreground rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                  <Info className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
          </div>
        </div>
        {isDownloadModalOpen && (
          <DownloadModal
            isOpen={isDownloadModalOpen}
            onClose={() => setIsDownloadModalOpen(false)}
            imageUrl={image}
            imageIndex={imageIndex}
            totalImages={images.length}
            onDownloadWithWatermark={onDownloadFile}
            imageId={imageId} // Pass the imageId
          />
        )}
      </div>
    </div>
  )
}
