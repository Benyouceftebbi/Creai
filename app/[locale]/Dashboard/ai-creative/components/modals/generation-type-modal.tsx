"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Video, Sparkles, Play, Palette, Wand2, Zap, ArrowRight, Clock, Star } from "lucide-react"
import { useTranslations } from "next-intl"

interface GenerationTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: "image" | "reel") => void
}

export function GenerationTypeModal({ isOpen, onClose, onSelectType }: GenerationTypeModalProps) {
  const t = useTranslations("creativeAi")

  const handleTypeSelect = (type: "image" | "reel") => {
    onSelectType(type)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 w-[95vw] sm:w-full">
        {/* Compact Mobile Header */}
        <DialogHeader className="p-3 sm:p-6 pb-2 sm:pb-4 text-center">
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-lg">
            <Sparkles className="h-5 w-5 sm:h-8 sm:w-8 text-gradient bg-gradient-to-r from-purple-600 to-blue-600" />
          </div>
          <DialogTitle className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-slate-50 dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
            What would you like to create?
          </DialogTitle>
          <p className="text-xs sm:text-base text-gray-600 dark:text-slate-400 mt-1 px-2">
            Choose the type of content you want to generate with AI
          </p>
        </DialogHeader>

        <div className="px-3 sm:px-6 pb-3 sm:pb-6">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col sm:grid sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            {/* Image Generation Card - Compact for mobile */}
            <div
              onClick={() => handleTypeSelect("image")}
              className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg border-2 border-purple-100 dark:border-purple-900/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer relative overflow-hidden active:scale-[0.98]"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-2xl" />

              {/* Compact floating elements */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-400/30 rounded-full animate-pulse delay-1000"></div>

              <div className="relative z-10">
                {/* Compact header section */}
                <div className="flex items-center mb-3 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md sm:rounded-xl mr-2 sm:mr-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base sm:text-2xl font-bold text-gray-800 dark:text-slate-200 leading-tight">
                      {t("imageGenerator")}
                    </h2>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 px-1.5 py-0.5"
                      >
                        <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        AI Powered
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-purple-200 text-purple-600 dark:border-purple-800 dark:text-purple-400 px-1.5 py-0.5"
                      >
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        ~90s
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Compact features list */}
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full"></div>
                    <span>High-quality product images</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Multiple aspect ratios</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Professional marketing ready</span>
                  </div>
                </div>

                <p className="text-xs sm:text-base text-gray-600 dark:text-slate-400 mb-4 sm:mb-8 leading-relaxed">
                  {t("imageGeneratorDescription")}
                </p>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-semibold py-2.5 sm:py-4 text-sm sm:text-lg rounded-lg sm:rounded-xl"
                >
                  <Palette className="h-3 w-3 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  {t("createImage")}
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Reel Generation Card - Compact for mobile */}
            <div
              onClick={() => handleTypeSelect("reel")}
              className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg border-2 border-blue-100 dark:border-blue-900/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer relative overflow-hidden active:scale-[0.98]"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-2xl" />

              {/* Compact floating elements */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-teal-400/30 rounded-full animate-pulse delay-1500"></div>

              <div className="relative z-10">
                {/* Compact header section */}
                <div className="flex items-center mb-3 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md sm:rounded-xl mr-2 sm:mr-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Video className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base sm:text-2xl font-bold text-gray-800 dark:text-slate-200 leading-tight">
                      {t("reelGenerator")}
                    </h2>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-1.5 py-0.5"
                      >
                        <Wand2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        Advanced AI
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400 px-1.5 py-0.5"
                      >
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        ~90s
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Compact features list */}
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Dynamic video content</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Social media optimized</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Engaging animations</span>
                  </div>
                </div>

                <p className="text-xs sm:text-base text-gray-600 dark:text-slate-400 mb-4 sm:mb-8 leading-relaxed">
                  {t("reelGeneratorDescription")}
                </p>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-semibold py-2.5 sm:py-4 text-sm sm:text-lg rounded-lg sm:rounded-xl"
                >
                  <Play className="h-3 w-3 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  {t("createReel")}
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Compact bottom info section */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                <span className="font-medium">AI-Powered Creation</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="font-medium">Professional Quality</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span className="font-medium">Fast Generation</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
