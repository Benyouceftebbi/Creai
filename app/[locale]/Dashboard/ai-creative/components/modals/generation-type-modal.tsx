"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Video, Sparkles, Play, Palette, Wand2, Zap, ArrowRight } from "lucide-react"
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-gradient bg-gradient-to-r from-purple-600 to-blue-600" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-slate-50 dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
            What would you like to create?
          </DialogTitle>
          <p className="text-base text-gray-600 dark:text-slate-400 mt-2">
            Choose the type of content you want to generate with AI
          </p>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Generation Card */}
            <div
              onClick={() => handleTypeSelect("image")}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200">{t("imageGenerator")}</h2>
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
                <p className="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                  {t("imageGeneratorDescription")}
                </p>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold py-4"
                >
                  <Palette className="h-5 w-5 mr-2" />
                  {t("createImage")}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Reel Generation Card */}
            <div
              onClick={() => handleTypeSelect("reel")}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200">{t("reelGenerator")}</h2>
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
                <p className="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                  {t("reelGeneratorDescription")}
                </p>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold py-4"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {t("createReel")}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
