"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase/firebase"
import { Sparkles, Brain, Zap, Target, ArrowRight, Pause } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"

interface MediaItem {
  id: string
  type: "image" | "reel"
  image: string
  beforeImage?: string
  user: string
  prompt: string
  duration?: string
  createdAt: Date
}

// Memoized placeholder items creation - ALL 25 are images (no videos in local files)
const PLACEHOLDER_ITEMS: MediaItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `placeholder-${i + 1}`,
  type: "image", // All local files are images
  image: `/images/before-after/${i + 1}.webp`,
  user: "AI Studio",
  prompt: `Creative AI Generation ${i + 1}`,
  createdAt: new Date(),
}))

// Utility function to convert Firestore timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate()
  }
  return new Date()
}

export function HeroWithMediaBackground() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/Auth/SignIn")
  }

  const t = useTranslations("creativeAii")
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(PLACEHOLDER_ITEMS)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const scrollPositionRef = useRef(0)

  // Memoize duplicated items to avoid recreation on every render
  const duplicatedMediaItems = useMemo(() => {
    return [...mediaItems, ...mediaItems, ...mediaItems]
  }, [mediaItems])

  // Memoize stats calculations
  const stats = useMemo(() => {
    const totalImages = mediaItems.length * 10
    const totalReels = mediaItems.filter((item) => item.type === "reel").length * 5
    return { totalImages, totalReels }
  }, [mediaItems])

  // Optimized Firebase fetch with better error handling
  useEffect(() => {
    let isMounted = true

    const fetchCreativeAiInspirations = async () => {
      try {
        const creativeAiCollectionRef = collection(db, "CreativeAi")
        const querySnapshot = await getDocs(creativeAiCollectionRef)

        if (!isMounted) return

        const fetchedItems: MediaItem[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.prompt && data.image && data.type && data.user) {
            fetchedItems.push({
              id: doc.id,
              image: data.image as string,
              beforeImage: data.beforeImage as string | undefined,
              user: data.user as string,
              prompt: data.prompt as string,
              type: data.type as "image" | "reel", // Firebase data can contain both images and videos
              duration: data.duration as string | undefined,
              createdAt: data.createdAt ? timestampToDate(data.createdAt) : new Date(),
            })
          }
        })

        if (fetchedItems.length > 0 && isMounted) {
          // Use functional update to avoid stale closure
          setMediaItems((prevItems) => [...prevItems, ...fetchedItems])
        }
      } catch (error) {
        console.error("Error fetching CreativeAI inspirations:", error)
      }
    }

    // Add small delay to not block initial render
    const timeoutId = setTimeout(fetchCreativeAiInspirations, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  // Optimized animation with better performance
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const itemHeight = 212 // 200px + 12px gap
    const totalOriginalHeight = Math.ceil(mediaItems.length / 3) * itemHeight

    const animate = () => {
      if (!isHovered && container) {
        scrollPositionRef.current += 1.5

        if (scrollPositionRef.current >= totalOriginalHeight) {
          scrollPositionRef.current = 0
        }

        container.scrollTop = scrollPositionRef.current
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered, mediaItems.length])

  // Memoized event handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  // Optimized error handler for images
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233B82F6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%239333EA;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fill='white' fontSize='12' opacity='0.5'%3EAI%3C/text%3E%3C/svg%3E"
  }, [])

  // Optimized error handler for videos
  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const target = e.target as HTMLVideoElement
    const container = target.parentElement
    if (container) {
      container.innerHTML = `
        <div class="relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
          <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div class="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-white border-y-[3px] sm:border-y-[4px] border-y-transparent ml-0.5"></div>
          </div>
        </div>
      `
    }
  }, [])

  return (
    <div className="relative">
      {/* Preload critical local images - these load immediately */}
      <link rel="preload" href="/images/before-after/1.webp" as="image" />
      <link rel="preload" href="/images/before-after/2.webp" as="image" />
      <link rel="preload" href="/images/before-after/3.webp" as="image" />
      <link rel="preload" href="/images/before-after/4.webp" as="image" />
      <link rel="preload" href="/images/before-after/5.webp" as="image" />

      {/* Available Now Badge */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg">
          <Sparkles size={14} className="sm:w-4 sm:h-4" />
          {t("availableNow")}
        </div>
      </div>

      <section className="relative w-full h-screen sm:h-[80vh] lg:h-[70vh] overflow-hidden">
        {/* Background Media Showcase */}
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-hidden will-change-scroll"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Media Grid */}
          <div className="p-2 sm:p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4">
              {duplicatedMediaItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="aspect-square overflow-hidden rounded-md sm:rounded-lg shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 will-change-transform"
                >
                  {item.type === "image" ? (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.prompt || t("aiGeneratedContent")}
                      className="w-full h-full object-cover"
                      loading={index < 25 ? "eager" : "lazy"} // Load first 25 (local images) eagerly
                      decoding="async"
                      onError={handleImageError}
                    />
                  ) : (
                    // Videos only appear when Firebase data loads
                    <video
                      src={item.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata" // Videos from Firebase - load metadata only
                      className="w-full h-full object-cover"
                      onError={handleVideoError}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 sm:bg-black/50 dark:bg-black/75 dark:sm:bg-black/70" />

        {/* Pause Overlay */}
        {isHovered && (
          <div className="absolute top-16 sm:top-20 left-4 sm:left-6 z-20 bg-black/80 dark:bg-white/90 text-white dark:text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 backdrop-blur-sm">
            <Pause size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{t("scrollPaused")}</span>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-gray-100 leading-tight">
                    {t("aiPowered")}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300">
                      {t("creativeStudio")}
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-200 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {t("description")}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-xl"
                  >
                    {t("tryItNow")}
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>

                {/* Stats - Updated to reflect the content structure */}
                <div className="flex flex-wrap gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-white/20 dark:border-gray-300/20 justify-center lg:justify-start">
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">
                      {stats.totalImages}+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">{t("imagesGenerated")}</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">
                      {stats.totalReels > 0 ? `${stats.totalReels}+` : "Coming Soon"}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">{t("reelPreviews")}</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">90%</div>
                    <div className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">{t("cheaper")}</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Features */}
              <div className="hidden lg:block space-y-6">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10 hover:bg-white/15 dark:hover:bg-black/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500/20 dark:bg-blue-400/30 backdrop-blur-sm p-3 rounded-xl border border-blue-400/30 dark:border-blue-300/40">
                      <Brain className="text-blue-300 dark:text-blue-200" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">
                        {t("intelligentContentGeneration")}
                      </h3>
                      <p className="text-gray-300 dark:text-gray-400">{t("intelligentContentDescription")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10 hover:bg-white/15 dark:hover:bg-black/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-500/20 dark:bg-purple-400/30 backdrop-blur-sm p-3 rounded-xl border border-purple-400/30 dark:border-purple-300/40">
                      <Zap className="text-purple-300 dark:text-purple-200" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">
                        {t("lightningFastProcessing")}
                      </h3>
                      <p className="text-gray-300 dark:text-gray-400">{t("lightningFastDescription")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10 hover:bg-white/15 dark:hover:bg-black/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500/20 dark:bg-green-400/30 backdrop-blur-sm p-3 rounded-xl border border-green-400/30 dark:border-green-300/40">
                      <Target className="text-green-300 dark:text-green-200" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">
                        {t("precisionCustomization")}
                      </h3>
                      <p className="text-gray-300 dark:text-gray-400">{t("precisionDescription")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
