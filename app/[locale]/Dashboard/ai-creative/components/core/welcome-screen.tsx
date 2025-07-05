"use client"

import type React from "react"

import { useState, useEffect } from "react" // Added useState, useEffect
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CreationDetail } from "@/components/types"
import {
  ImageIcon,
  Video,
  Sparkles,
  Users,
  Eye,
  Heart,
  Loader2,
  Play,
  Zap,
  Palette,
  Wand2,
  Star,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// Helper to handle image errors and switch to placeholder (can be in a shared utils file)
const ImageWithFallback = ({
  src,
  alt,
  className,
  style,
  fallbackText,
  imgClassName,
}: {
  src: string | undefined
  alt: string
  className?: string // Class for the wrapper div
  style?: React.CSSProperties // Style for the wrapper div
  imgClassName?: string // Class for the img element itself
  fallbackText: string
}) => {
  const [imgSrc, setImgSrc] = useState(src)
  const placeholderUrl = `/placeholder.svg?height=${(style?.height as number) || 300}&width=${(style?.width as number) || 400}&text=${encodeURIComponent(fallbackText)}`

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  const handleError = () => {
    setImgSrc(placeholderUrl)
  }

  return (
    <div className={className} style={style}>
      <img
        src={imgSrc || placeholderUrl}
        alt={alt}
        className={imgClassName} // Apply specific image classes here
        onError={handleError}
      />
    </div>
  )
}

interface WelcomeScreenProps {
  onStartCreation: (type: string) => void
  inspirationItems: CreationDetail[]
  onInspirationClick: (creation: CreationDetail) => void
  isLoadingInspirations: boolean
}

export function WelcomeScreen({
  onStartCreation,
  inspirationItems,
  onInspirationClick,
  isLoadingInspirations,
}: WelcomeScreenProps) {
  const t = useTranslations("creativeAi")
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8 flex flex-col overflow-y-auto">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
        <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl mb-4 sm:mb-6 animate-in fade-in zoom-in-90 delay-200 duration-500 shadow-lg">
          <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-slate-50 dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent mb-3 sm:mb-4 animate-in fade-in slide-in-from-bottom-4 delay-100 duration-500">
          {t("welcomeTitle")}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 delay-200 duration-500">
          {t("welcomeDescription")}
        </p>
      </div>

      {/* Enhanced Creation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-16 max-w-5xl mx-auto w-full">
        <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] animate-in fade-in slide-in-from-left-10 delay-300 duration-500 ease-out relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

          <div className="relative z-10">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mr-3 sm:mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-200">
                  {t("imageGenerator")}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
              {t("imageGeneratorDescription")}
            </p>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold py-3 sm:py-4"
              onClick={() => onStartCreation("image")}
            >
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> {t("createImage")}
            </Button>
          </div>
        </div>

        <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] animate-in fade-in slide-in-from-right-10 delay-400 duration-500 ease-out relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

          <div className="relative z-10">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3 sm:mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Video className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-200">
                  {t("reelGenerator")}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    Advanced AI
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
              {t("reelGeneratorDescription")}
            </p>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold py-3 sm:py-4"
              onClick={() => onStartCreation("reel")}
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> {t("createReel")}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Inspirations Section */}
      <div className="mt-8 border-t border-border/50 pt-8 sm:pt-12 animate-in fade-in slide-in-from-bottom-8 delay-500 duration-500 ease-out">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-200">
            {t("communityInspirations")}
          </h2>
        </div>
        {isLoadingInspirations ? (
          <div className="flex justify-center items-center py-16 sm:py-20">
            <div className="text-center">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400">{t("loadingInspirations")}</p>
            </div>
          </div>
        ) : inspirationItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {inspirationItems.map((creation, index) => (
              <div
                key={creation.id}
                onClick={() => onInspirationClick(creation)}
                className={cn(
                  "group relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-slate-700/60 overflow-hidden transition-all duration-500 cursor-pointer",
                  "hover:shadow-2xl hover:shadow-primary/25 hover:border-primary/40 hover:-translate-y-2 hover:scale-[1.03]",
                  "animate-in fade-in zoom-in-95 ease-out",
                )}
                style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: "both" }}
              >
                {/* Enhanced Image Container */}
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  {creation.type === "reel" ? (
                    <div className="w-full h-full relative">
                      <ImageWithFallback
                        src={creation.beforeImage || creation.image || "/placeholder.svg"}
                        alt={`${creation.user}'s reel`}
                        imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        fallbackText="Reel"
                        style={{ width: "100%", height: "100%" }}
                      />
                      {/* Enhanced Play Button Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                        <div className="bg-white/25 backdrop-blur-md rounded-full p-4 group-hover:scale-125 group-hover:bg-white/35 transition-all duration-500 shadow-2xl border border-white/20">
                          <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white drop-shadow-2xl" fill="currentColor" />
                        </div>
                      </div>
                      {/* Duration Badge */}
                      {creation.duration && (
                        <Badge
                          variant="secondary"
                          className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2.5 py-1 backdrop-blur-sm border border-white/20 shadow-lg"
                        >
                          {creation.duration}
                        </Badge>
                      )}
                      {/* Type Badge */}
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 bg-blue-500/90 text-white text-xs px-2.5 py-1 backdrop-blur-sm border border-white/20 shadow-lg"
                      >
                        <Video className="h-3 w-3 mr-1" />
                        Reel
                      </Badge>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <ImageWithFallback
                        src={creation.image || "/placeholder.svg"}
                        alt={`${creation.user}'s creation`}
                        imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        fallbackText="Image"
                        style={{ width: "100%", height: "100%" }}
                      />
                      {/* Type Badge */}
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 bg-purple-500/90 text-white text-xs px-2.5 py-1 backdrop-blur-sm border border-white/20 shadow-lg"
                      >
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Image
                      </Badge>
                      {/* Quality Badge */}
                      <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs px-2.5 py-1 backdrop-blur-sm border border-white/20 shadow-lg"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        HD
                      </Badge>
                    </div>
                  )}

                  {/* Enhanced Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full bg-white/95 hover:bg-white text-gray-800 dark:bg-slate-100/95 dark:hover:bg-slate-100 dark:text-slate-800 backdrop-blur-sm shadow-xl font-semibold border border-white/50 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Enhanced Card Footer */}
                <div className="p-4 bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-sm border-t border-gray-100/50 dark:border-slate-700/50">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <ImageWithFallback
                      src={creation.avatar || "/placeholder.svg"}
                      alt={creation.user}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-600 shadow-md"
                      fallbackText="U"
                      style={{ width: 32, height: 32 }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-gray-800 dark:text-slate-200 truncate block">
                        {creation.user}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Popular
                        </span>
                        {creation.createdAt && <span>{new Date(creation.createdAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
                        <Heart className="h-4 w-4 fill-current" />
                        {(creation.likes || 0).toLocaleString()}
                      </span>
                      {creation.settings?.quality && (
                        <Badge
                          variant="outline"
                          className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-900/30"
                        >
                          {creation.settings.quality}
                        </Badge>
                      )}
                    </div>

                    {/* Model Info */}
                    {creation.settings?.model && (
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-900/30"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {creation.settings?.model || "AI"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-slate-500" />
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
              No inspirations yet
            </h4>
            <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400">
              Check back soon for amazing community creations!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
