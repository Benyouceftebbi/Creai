"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebase/firebase"
import { Sparkles, Brain, Zap, Target, ArrowRight, Pause } from "lucide-react"

import { useTranslations } from "next-intl"

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

const fallbackMediaItems: MediaItem[] = [
  {
    id: "1",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Beautiful landscape",
    createdAt: new Date(),
  },
  {
    id: "2",
    type: "reel",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Creative video",
    createdAt: new Date(),
  },
  {
    id: "3",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Abstract art",
    createdAt: new Date(),
  },
  {
    id: "4",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Digital painting",
    createdAt: new Date(),
  },
  {
    id: "5",
    type: "reel",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Motion graphics",
    createdAt: new Date(),
  },
  {
    id: "6",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Portrait art",
    createdAt: new Date(),
  },
  {
    id: "7",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Fantasy scene",
    createdAt: new Date(),
  },
  {
    id: "8",
    type: "reel",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Animation loop",
    createdAt: new Date(),
  },
  {
    id: "9",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Sci-fi concept",
    createdAt: new Date(),
  },
  {
    id: "10",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Nature photography",
    createdAt: new Date(),
  },
  {
    id: "11",
    type: "reel",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Dynamic transition",
    createdAt: new Date(),
  },
  {
    id: "12",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Minimalist design",
    createdAt: new Date(),
  },
  {
    id: "13",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Vintage style",
    createdAt: new Date(),
  },
  {
    id: "14",
    type: "reel",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Color explosion",
    createdAt: new Date(),
  },
  {
    id: "15",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Geometric patterns",
    createdAt: new Date(),
  },
  {
    id: "16",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Watercolor effect",
    createdAt: new Date(),
  },
  {
    id: "17",
    type: "reel",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Particle system",
    createdAt: new Date(),
  },
  {
    id: "18",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Urban architecture",
    createdAt: new Date(),
  },
  {
    id: "19",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Ocean waves",
    createdAt: new Date(),
  },
  {
    id: "20",
    type: "reel",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Light effects",
    createdAt: new Date(),
  },
  {
    id: "21",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Space exploration",
    createdAt: new Date(),
  },
  {
    id: "22",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Food photography",
    createdAt: new Date(),
  },
  {
    id: "23",
    type: "reel",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Morphing shapes",
    createdAt: new Date(),
  },
  {
    id: "24",
    type: "image",
    image: "/placeholder.svg?height=300&width=300",
    user: "AI Studio",
    prompt: "Character design",
    createdAt: new Date(),
  },
]

// Utility function to convert Firestore timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate()
  }
  return new Date()
}

export function HeroWithMediaBackground() {
  const t = useTranslations("creativeAii")

  const [creativeAiItems, setCreativeAiItems] = useState<MediaItem[]>([])
  const [creativeAiLoading, setCreativeAiLoading] = useState(true)
  const [creativeAiError, setCreativeAiError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Fetch data from Firebase
  useEffect(() => {
    const fetchCreativeAiInspirations = async () => {
      setCreativeAiLoading(true)
      setCreativeAiError(null)
      try {
        const creativeAiCollectionRef = collection(db, "CreativeAi")
        const querySnapshot = await getDocs(creativeAiCollectionRef)
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
              type: data.type as "image" | "reel",
              duration: data.duration as string | undefined,
              createdAt: data.createdAt ? timestampToDate(data.createdAt) : new Date(),
            })
          }
        })
        setCreativeAiItems(fetchedItems)
      } catch (error) {
        console.error("Error fetching CreativeAI inspirations:", error)
        setCreativeAiError("Could not load community inspirations.")
      } finally {
        setCreativeAiLoading(false)
      }
    }
    fetchCreativeAiInspirations()
  }, [])

  // Use creativeAiItems if available, otherwise fallback to placeholder items
  const mediaItems =
    creativeAiItems && Array.isArray(creativeAiItems) && creativeAiItems.length > 0
      ? creativeAiItems
      : fallbackMediaItems

  // Duplicate media items for infinite scroll
  const duplicatedMediaItems = [...mediaItems, ...mediaItems, ...mediaItems]

  useEffect(() => {
    const animate = () => {
      if (!isHovered && containerRef.current) {
        setScrollPosition((prev) => {
          const container = containerRef.current!
          const itemHeight = 200 + 12 // Smaller item height for mobile + gap
          const totalOriginalHeight = Math.ceil(mediaItems.length / 3) * itemHeight // Mobile has 3 columns
          const newPosition = prev + 1.5 // Slightly slower scroll for mobile

          // Reset position when we've scrolled through one complete set
          if (newPosition >= totalOriginalHeight) {
            container.scrollTop = 0
            return 0
          }

          container.scrollTop = newPosition
          return newPosition
        })
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

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div className="relative">
      {/* Available Now Badge - Mobile optimized */}
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
          className="absolute inset-0 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Media Grid - Mobile optimized */}
          <div className="p-2 sm:p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4">
              {duplicatedMediaItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="aspect-square overflow-hidden rounded-md sm:rounded-lg shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {item.type === "image" ? (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.prompt || t("aiGeneratedContent")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if video fails to load
                        const target = e.target as HTMLVideoElement
                        target.style.display = "none"
                        const fallbackDiv = document.createElement("div")
                        fallbackDiv.className =
                          "relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
                        fallbackDiv.innerHTML = `
                          <div class="w-6 h-6 sm:w-8 sm:h-8 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <div class="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-white border-y-[3px] sm:border-y-[4px] border-y-transparent ml-0.5"></div>
                          </div>
                        `
                        target.parentNode?.appendChild(fallbackDiv)
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/60 sm:bg-black/50 dark:bg-black/75 dark:sm:bg-black/70" />

        {/* Pause Overlay - Mobile optimized */}
        {isHovered && (
          <div className="absolute top-16 sm:top-20 left-4 sm:left-6 z-20 bg-black/80 dark:bg-white/90 text-white dark:text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 backdrop-blur-sm">
            <Pause size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{t("scrollPaused")}</span>
          </div>
        )}

        {/* Hero Content - Mobile optimized */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* Main Content */}
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
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-xl"
                  >
                    {t("tryItNow")}
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>

                {/* Stats - Mobile optimized */}
                <div className="flex flex-wrap gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-white/20 dark:border-gray-300/20 justify-center lg:justify-start">
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">
                      {creativeAiLoading ? "..." : `${mediaItems.length * 10}+`}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">{t("imagesGenerated")}</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">
                      {creativeAiLoading ? "..." : `${mediaItems.filter((item) => item.type === "reel").length * 5}+`}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">{t("reelPreviews")}</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">90%</div>
                    <div className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">{t("cheaper")}</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Features - Hidden on mobile, shown on lg+ */}
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
