"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CreationDetail } from "@/components/types"
import { Users, Eye, Loader2, Sparkles, ArrowRight, Wand2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// Helper to handle image errors and switch to placeholder
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
  className?: string
  style?: React.CSSProperties
  imgClassName?: string
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
      <img src={imgSrc || placeholderUrl} alt={alt} className={imgClassName} onError={handleError} />
    </div>
  )
}

interface WelcomeScreenProps {
  onStartCreation: (type: string) => void
  inspirationItems: CreationDetail[]
  onInspirationClick: (creation: CreationDetail) => void
  isLoadingInspirations: boolean
  onOpenGenerationTypeModal: () => void // New prop for opening the modal
}

export function WelcomeScreen({
  onStartCreation,
  inspirationItems,
  onInspirationClick,
  isLoadingInspirations,
  onOpenGenerationTypeModal,
}: WelcomeScreenProps) {
  const t = useTranslations("creativeAi")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 delay-200 duration-500 mb-8">
          {t("welcomeDescription")}
        </p>

        {/* Single Create Button - Hidden on mobile */}
        <div className="hidden md:block animate-in fade-in slide-in-from-bottom-4 delay-300 duration-500">
          <Button
            size="lg"
            onClick={onOpenGenerationTypeModal}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 hover:from-purple-700 hover:via-blue-700 hover:to-teal-600 text-white font-bold px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-2xl"
          >
            <Plus className="h-6 w-6 mr-3" />
            Create Amazing Content
            <Wand2 className="h-5 w-5 ml-3" />
          </Button>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">
            Choose between images or reels • Powered by AI
          </p>
        </div>
      </div>

      {/* Enhanced Inspirations Section - Title hidden on mobile */}
      <div className="animate-in fade-in slide-in-from-bottom-8 delay-400 duration-500 ease-out">
        <div className="hidden md:flex items-center gap-3 mb-6 sm:mb-8">
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
                style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: "both" }}
              >
                {/* Enhanced Image Container */}
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <div className="w-full h-full flex">
                    {/* Left: Before Image */}
                    <div className="w-1/2 h-full relative">
                      <ImageWithFallback
                        src={creation.beforeImage || "/placeholder.svg"} // Now just a string
                        alt="Before"
                        imgClassName="w-full h-full object-cover transition-transform duration-700"
                        fallbackText="Before"
                        style={{ width: "100%", height: "100%" }}
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 bg-yellow-500/90 text-white text-xs px-2.5 py-1 backdrop-blur-sm border border-white/20 shadow-lg"
                      >
                        Before
                      </Badge>
                    </div>

                    {/* Right: After Image */}
                    <div className="w-1/2 h-full relative">
                      <ImageWithFallback
                        src={creation.image || "/placeholder.svg"}
                        alt="After"
                        imgClassName="w-full h-full object-cover transition-transform duration-700"
                        fallbackText="After"
                        style={{ width: "100%", height: "100%" }}
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 bg-green-500/90 text-white text-xs px-2.5 py-1 backdrop-blur-sm border border-white/20 shadow-lg"
                      >
                        After
                      </Badge>
                    </div>
                  </div>

                  {/* Hover Overlay */}
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
                  {/* Stats Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
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

      {/* Bottom CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 shadow-2xl">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg%20width='30'%20height='30'%20viewBox='0%200%2030%2030'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='%23ffffff'%20fillOpacity='0.3'%3E%3Ccircle%20cx='15'%20cy='15'%20r='1'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Floating Elements */}
        <div
          className="absolute top-1 left-4 w-3 h-3 bg-white/20 rounded-full animate-bounce"
          style={{ animationDuration: "2s" }}
        />
        <div
          className="absolute top-2 right-8 w-2 h-2 bg-white/20 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "3s" }}
        />

        <div className="relative px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles
                  className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm md:text-lg leading-tight">
                  Want your product to look{" "}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-pulse">
                    this good?
                  </span>
                </h3>
                <p className="text-white/80 text-xs md:text-sm hidden sm:block">Transform with AI • Free trial</p>
              </div>
            </div>

            {/* Right CTA Button */}
            <div className="flex-shrink-0">
              <Button
                size="lg"
                onClick={onOpenGenerationTypeModal}
                className="group relative overflow-hidden bg-white text-purple-600 hover:bg-gray-100 font-bold px-4 py-2 md:px-6 md:py-3 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Create Ad Now!
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
              </Button>
            </div>
          </div>

          {/* Mobile-only stats */}
          <div className="sm:hidden mt-2 flex justify-center gap-4 text-white/70 text-xs">
            <span>10k+ Enhanced</span>
            <span>•</span>
            <span>98% Satisfaction</span>
            <span>•</span>
            <span>2min Process</span>
          </div>
        </div>

        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
      </div>

      {/* Add bottom padding to main content to prevent overlap */}
      <div className="h-20 md:h-24" />
    </div>
  )
}
