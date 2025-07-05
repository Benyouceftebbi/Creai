"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { ChevronLeft, ChevronRight, Sparkles, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

interface BeforeAfterItem {
  id: string
  beforeImage: string
  afterImage: string
  prompt: string
  user: string
  category: string
}

// Generate items based on local folder structure
const generateLocalItems = (): BeforeAfterItem[] => {
  const items: BeforeAfterItem[] = []
  const categories = [
    "Fantasy",
    "Portrait",
    "Sci-Fi",
    "Nature",
    "Architecture",
    "Art",
    "Photography",
    "Digital Art",
    "Concept Art",
    "Illustration",
  ]

  // Generate 10 items based on the folder structure
  for (let i = 1; i <= 10; i++) {
    items.push({
      id: i.toString(),
      beforeImage: `/images/before-after/${i}b.webp`,
      afterImage: `/images/before-after/${i}.webp`,
      prompt: `AI transformation ${i}`,
      user: "Creative AI",
      category: categories[(i - 1) % categories.length],
    })
  }

  return items
}

const fallbackItems: BeforeAfterItem[] = [
  {
    id: "1",
    beforeImage: "/placeholder.svg?height=1024&width=1024",
    afterImage: "/placeholder.svg?height=1024&width=1024",
    prompt: "Transform this photo into a magical fantasy scene",
    user: "Creative AI",
    category: "Fantasy",
  },
  {
    id: "2",
    beforeImage: "/placeholder.svg?height=1024&width=1024",
    afterImage: "/placeholder.svg?height=1024&width=1024",
    prompt: "Convert to professional headshot with studio lighting",
    user: "Creative AI",
    category: "Portrait",
  },
  {
    id: "3",
    beforeImage: "/placeholder.svg?height=1024&width=1024",
    afterImage: "/placeholder.svg?height=1024&width=1024",
    prompt: "Transform into cyberpunk cityscape",
    user: "Creative AI",
    category: "Sci-Fi",
  },
]

export function BeforeAfterShowcase() {
  const t = useTranslations("beforeAfter")
  const [items, setItems] = useState<BeforeAfterItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const loadLocalImages = async () => {
      setIsLoading(true)
      try {
        // Generate items from local folder structure
        const localItems = generateLocalItems()

        // Check if images exist by trying to load the first one
        const testImage = new Image()
        testImage.onload = () => {
          setItems(localItems)
          setIsLoading(false)
        }
        testImage.onerror = () => {
          console.warn("Local images not found, using fallback items")
          setItems(fallbackItems)
          setIsLoading(false)
        }

        // Test with the first image
        testImage.src = localItems[0].beforeImage
      } catch (error) {
        console.error("Error loading local images:", error)
        setItems(fallbackItems)
        setIsLoading(false)
      }
    }

    loadLocalImages()
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    setSliderPosition(50)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
    setSliderPosition(50)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)

    // Also set initial position on touch start
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    const handleGlobalTouchEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener("mouseup", handleGlobalMouseUp)
    document.addEventListener("touchend", handleGlobalTouchEnd)

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("touchend", handleGlobalTouchEnd)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100/80 dark:bg-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Loading Transformations</span>
          </div>
          <div className="w-full max-w-2xl mx-auto aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  const currentItem = items[currentIndex]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-purple-100/80 dark:bg-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("beforeAfterShowcase")}</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("seeTheMagic")}</h2>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t("witnessTransformation")}</p>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Before/After Comparison */}
        <div className="relative max-w-2xl mx-auto">
          <div
            className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl cursor-col-resize select-none p-4 bg-gray-100 dark:bg-gray-800"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              {/* After Image (Base - always visible) */}
              <img
                src={currentItem.afterImage || "/placeholder.svg"}
                alt="After transformation"
                className="absolute inset-0 w-full h-full object-contain bg-white dark:bg-gray-900"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=1024&width=1024&text=After"
                }}
              />

              {/* Before Image with Clip Path (revealed on drag) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={currentItem.beforeImage || "/placeholder.svg"}
                  alt="Before transformation"
                  className="w-full h-full object-contain bg-white dark:bg-gray-900"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=1024&width=1024&text=Before"
                  }}
                />
              </div>

              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                Before
              </div>
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                After
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              <span>{currentItem.category}</span>
            </div>

            <p className="text-gray-600 dark:text-gray-400">Created by {currentItem.user}</p>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setSliderPosition(50)
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-12">
        <p className="text-gray-500 dark:text-gray-400 text-sm">💡 {t("dragSlider")}</p>
      </div>
    </div>
  )
}
