"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, TrendingUp, ShoppingCart, Zap, Sparkles } from "lucide-react"

interface ConversionModalProps {
  isOpen: boolean
  onClose: () => void
  handleStartCreation: (type: string) => void
}

export function ConversionModal({ isOpen, onClose, handleStartCreation }: ConversionModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
    const successStories = [
    {
      id: 1,
      productImage: "/images/image1.webp",
      adImage: "/images/image2.webp",
      conversionRate: "12.4%",
      orders: 100,
      timeSaved: "$100",
      improvement: "+340%",
    },
    {
      id: 2,
      productImage: "/images/image4.webp",
      adImage: "/images/image3.webp",
      conversionRate: "8.7%",
      orders: 80,
     timeSaved: "$100",
      improvement: "+280%",
    },
    {
      id: 3,
      productImage: "/images/image5.webp",
      adImage: "/images/image6.webp",
      conversionRate: "15.2%",
      orders: 90,
  timeSaved: "$100",
      improvement: "+420%",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % successStories.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + successStories.length) % successStories.length)
  }

  const wasOpen = useRef(isOpen)

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      handleStartCreation("image")
    }
    wasOpen.current = isOpen
  }, [isOpen, handleStartCreation])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] md:w-full max-h-[95vh] md:max-h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950 dark:via-slate-900 dark:to-blue-950 border-0 md:border">
        <div className="relative h-full max-h-[95vh] md:max-h-[90vh] flex flex-col">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-50 p-2 md:p-2.5 rounded-full bg-white/95 hover:bg-white dark:bg-slate-800/95 dark:hover:bg-slate-800 transition-all duration-200 shadow-xl border border-slate-200 dark:border-slate-600 backdrop-blur-sm"
          >
            <X className="h-5 w-5 md:h-5 md:w-5 text-slate-700 dark:text-slate-200 stroke-2" />
          </button>

          {/* Header - Compact on mobile */}
          <div className="flex-shrink-0 text-center pt-10 pb-2 md:pt-8 md:pb-6 px-4 md:px-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-2 md:mb-4 animate-pulse">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              AI-Powered Success Stories
            </div>
            <h2 className="text-lg md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1 md:mb-2">
              See What Our AI Can Do
            </h2>
            <p className="hidden md:block text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Real results from businesses like yours who transformed their product images into high-converting ads
            </p>
          </div>

          {/* Main content - No scroll on mobile */}
          <div className="flex-1 px-3 md:px-8 overflow-hidden">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-3 md:p-8 h-full">
              {/* Mobile Layout - Stacked efficiently */}
              <div className="md:hidden h-full flex flex-col">
                {/* Images Section */}
                <div className="flex-shrink-0">
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Before → After</h3>
                  </div>
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Original Product */}
                      <div className="space-y-2">
                        <Badge
                          variant="secondary"
                          className="w-full justify-center text-xs dark:bg-slate-700 dark:text-slate-200"
                        >
                          Original Product
                        </Badge>
                        <div className="relative group">
                          <img
                            src={successStories[currentSlide].productImage || "/placeholder.svg"}
                            alt="Original product"
                            className="w-full h-48 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-600"
                          />
                        </div>
                      </div>
                      {/* AI Generated Ad */}
                      <div className="space-y-2">
                        <Badge className="w-full justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-xs">
                          AI Generated Ad
                        </Badge>
                        <div className="relative group">
                          <img
                            src={successStories[currentSlide].adImage || "/placeholder.svg"}
                            alt="AI generated ad"
                            className="w-full h-48 object-cover rounded-lg border-2 border-purple-200 dark:border-purple-400 shadow-lg"
                          />
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                            <TrendingUp className="h-2 w-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Navigation arrows */}
             <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white dark:bg-slate-700 rounded-full p-2 md:p-1 shadow-lg text-slate-900 dark:text-slate-100 text-lg md:text-base"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white dark:bg-slate-700 rounded-full p-2 md:p-1 shadow-lg text-slate-900 dark:text-slate-100 text-lg md:text-base"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Stats Section - Compact */}
                <div className="flex-1 flex flex-col justify-center py-3">
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Incredible Results</h3>
                  </div>
                  {/* Compact Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-2 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-700 dark:text-green-400">
                          {successStories[currentSlide].conversionRate}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-300">Conversion</div>
                        <Badge
                          variant="secondary"
                          className="mt-1 bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 text-xs"
                        >
                          {successStories[currentSlide].improvement}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-2 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="text-center">
                        <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                          {successStories[currentSlide].orders}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-300">Orders/Day</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-2 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                          {successStories[currentSlide].timeSaved}
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-300">Money Saved</div>
                      </div>
                    </div>
                  </div>
                  {/* Slide indicators */}
                  <div className="flex justify-center gap-2">
                    {successStories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSlide ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Original */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left side - Images */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Before → After</h3>
                  </div>
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Original Product */}
                      <div className="space-y-3">
                        <Badge
                          variant="secondary"
                          className="w-full justify-center text-xs dark:bg-slate-700 dark:text-slate-200"
                        >
                          Original Product
                        </Badge>
                        <div className="relative group">
                          <img
                            src={successStories[currentSlide].productImage || "/placeholder.svg"}
                            alt="Original product"
                            className="w-full h-80 object-cover rounded-lg border-2 border-slate-200 dark:border-slate-600"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      {/* AI Generated Ad */}
                      <div className="space-y-3">
                        <Badge className="w-full justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-xs">
                          AI Generated Ad
                        </Badge>
                        <div className="relative group">
                          <img
                            src={successStories[currentSlide].adImage || "/placeholder.svg"}
                            alt="AI generated ad"
                            className="w-full h-80 object-cover rounded-lg border-2 border-purple-200 dark:border-purple-400 shadow-lg transform hover:scale-105 transition-transform"
                          />
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Navigation arrows */}
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-slate-700 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow text-slate-900 dark:text-slate-100"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-slate-700 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow text-slate-900 dark:text-slate-100"
                    >
                      →
                    </button>
                  </div>
                  {/* Slide indicators */}
                  <div className="flex justify-center gap-2">
                    {successStories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSlide ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right side - Stats and CTA */}
                <div className="flex flex-col">
                  <div className="flex-1 space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Incredible Results</h3>
                    </div>
                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            {successStories[currentSlide].conversionRate}
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-300">Conversion Rate</div>
                          <Badge
                            variant="secondary"
                            className="mt-2 bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 text-xs"
                          >
                            {successStories[currentSlide].improvement}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                        <div className="text-center">
                          <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                            {successStories[currentSlide].orders.toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-300">Orders/Day</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700 col-span-2">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                            {successStories[currentSlide].timeSaved}
                          </div>
                          <div className="text-sm text-purple-600 dark:text-purple-300">Money saved</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section - Fixed at bottom */}
          <div className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 p-3 md:p-6 shadow-lg">
            <div className="max-w-md mx-auto space-y-2 md:space-y-3">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-2">
                  <Zap className="h-3 w-3 md:h-4 md:w-4" />
                  Limited Time Offer
                </div>
                <p className="text-sm md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Get 2 AI Ad Generations FREE
                </p>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mb-2">
                  No credit card required • See results in minutes
                </p>
              </div>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 md:py-4 text-sm md:text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                onClick={() => {
                  handleStartCreation("image")
                  onClose()
                }}
                aria-label="Start AI Ad Generation"
              >
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Try Now - Generate 2 Free Ads
              </Button>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                Join 10,000+ businesses already using our AI
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
