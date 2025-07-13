"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Crown,
  Check,
  X,
  Sparkles,
  Shield,
  Zap,
  Star,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { collection, addDoc, onSnapshot, updateDoc, doc } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { useShop } from "@/app/context/ShopContext"
import { toast } from "@/hooks/use-toast"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string // This will be the standard quality image for preview/free download
  highQualityImageUrl: string // New prop for the high quality image
  imageIndex?: number
  totalImages?: number
  onDownloadWithWatermark: (imageUrl: string, filename: string) => void // This prop is now explicitly for watermarked/free downloads
  imageId: string // Added imageId prop
}

const pricingPlans = [
  {
    id: "free",
    name: "Free Download",
    price: "$0",
    originalPrice: null,
    description: "Download with watermark",
    features: ["Includes watermark", "Standard quality", "Instant download"],
    icon: Droplets,
    color: "gray",
    popular: false,
    priceId: null,
    badge: "FREE",
    badgeColor: "bg-gray-500",
    savings: null,
  },
  {
    id: "price_1RkWByDIpjCcuDeHMAGL8RiJ",
    name: "Single HD",
    price: "$0.99",
    originalPrice: "$1.99",
    description: "This image without watermark",
    features: ["No watermark", "HD quality", "Commercial license", "Instant download"],
    icon: Star,
    color: "blue",
    popular: false,
    priceId: "price_single_image",
    badge: "HD",
    badgeColor: "bg-blue-500",
    savings: "50% OFF",
  },
  {
    id: "price_1RkWCmDIpjCcuDeHRzpB6PH5",
    name: "6-Pack Pro",
    price: "$2.99",
    originalPrice: "$5.97",
    description: "6 watermark-free downloads",
    features: ["6 download credits", "No watermarks", "HD quality", "Commercial license", "Valid for 30 days"],
    icon: Zap,
    color: "purple",
    popular: true,
    priceId: "price_3_images_pack",
    badge: "POPULAR",
    badgeColor: "bg-purple-500",
    savings: "50% OFF",
  },
  {
    id: "price_1RkWDADIpjCcuDeHcnaG3aMB",
    name: "12-Pack VIP",
    price: "$4.99",
    originalPrice: "$23.88",
    description: "12 watermark-free downloads",
    features: [
      "12 download credits",
      "No watermarks",
      "4K quality",
      "Commercial license",
      "Valid for 60 days",
      "Priority support",
    ],
    icon: Crown,
    color: "gold",
    popular: false,
    priceId: "price_12_images_pack",
    badge: "BEST VALUE",
    badgeColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
    savings: "79% OFF",
  },
]

export function DownloadModal({
  isOpen,
  onClose,
  imageUrl,
  highQualityImageUrl, // Destructure new prop
  imageIndex = 0,
  totalImages = 1,
  onDownloadWithWatermark, // This prop is now explicitly for watermarked/free downloads
  imageId, // Destructure imageId
}: DownloadModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>("pack3")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlanIndex, setCurrentPlanIndex] = useState(2)

  const { shopData } = useShop()
  const t = useTranslations("creativeAi")

  const handleFreeDownload = async () => {
    setIsLoading(true)
    try {
      const filename = `watermarked_image_${Date.now()}.png`

      // Call the provided onDownloadWithWatermark prop with the standard quality imageUrl
      onDownloadWithWatermark(imageUrl, filename)
      toast({
        title: "Download Started",
        description: "Your watermarked image is downloading...",
      })
      onClose()
    } catch (error) {
      console.error("Error during free download:", error)
      toast({
        title: "Download Failed",
        description: (error as Error).message || "Could not download watermarked image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaidDownload = async (priceId: string) => {
    setIsLoading(true)
    try {
      const checkoutSessionRef = collection(db, "Customers", shopData.id, "checkout_sessions")
      const docRef = await addDoc(checkoutSessionRef, {
        mode: "payment",
        price: priceId,
        // Pass highQualityImageUrl to the success_url
        success_url: `${window.location.origin}/payment-success?imgUrl=${encodeURIComponent(highQualityImageUrl)}`,
        cancel_url: window.location.href,
        allow_promotion_codes: true,
        client_reference_id: `${shopData.id}-${priceId}`,
        metadata: {
          // Also include imageId and imageIndex in metadata for server-side processing if needed
          imageId: imageId,
          imageIndex: imageIndex.toString(),
          downloadType: "premium",
        },
      })

      const unsubscribe = onSnapshot(docRef, (snap) => {
        const { error, url } = snap.data() || {}
        if (error) {
          toast({
            title: "Error",
            description: `An error occurred: ${error.message}`,
            variant: "destructive",
          })
          setIsLoading(false)
          unsubscribe()
        }
        if (url) {
          window.location.assign(url)
          setIsLoading(false)
          unsubscribe()
        }
      })
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handlePlanSelect = (planId: string) => {
    const plan = pricingPlans.find((p) => p.id === planId)
    if (!plan) return
    if (planId === "free") {
      handleFreeDownload()
    } else if (plan.priceId) {
      handlePaidDownload(plan.priceId)
    }
  }

  const currentPlan = pricingPlans[currentPlanIndex]
  const IconComponent = currentPlan.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 w-[95vw] sm:w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {/* Compact Mobile Header */}
        <DialogHeader className="relative p-3 pb-0">
          <Button variant="ghost" size="sm" onClick={onClose} className="absolute top-1 right-1 h-7 w-7 p-0 z-10">
            <X className="h-4 w-4" />
          </Button>

          <div className="text-center pt-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-lg font-bold mb-1">Ready to Download?</DialogTitle>
            <p className="text-xs text-muted-foreground">Choose your preferred option</p>
          </div>
        </DialogHeader>

        {/* Compact Image Preview */}
        <div className="px-3 mb-3">
          <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg p-2 border shadow-inner">
            <img
              src={imageUrl || "/placeholder.svg?height=80&width=120"}
              alt="Preview"
              className="w-full h-16 object-contain rounded-md"
            />
            <Badge className="absolute top-0.5 right-0.5 text-xs bg-black/70 text-white px-1.5 py-0.5">
              {imageIndex + 1}/{totalImages}
            </Badge>
          </div>
        </div>

        {/* Mobile: Compact Single Card View */}
        <div className="block sm:hidden px-3">
          {/* Compact Plan Navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPlanIndex((prev) => (prev - 1 + pricingPlans.length) % pricingPlans.length)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>

            <div className="flex gap-1.5">
              {pricingPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPlanIndex(index)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    index === currentPlanIndex ? "bg-primary w-4" : "bg-gray-300 dark:bg-gray-600",
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPlanIndex((prev) => (prev + 1) % pricingPlans.length)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          {/* Compact Current Plan Card */}
          <div className="relative">
            <div
              className={cn(
                "relative bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border-2 transition-all duration-300",
                currentPlan.popular
                  ? "border-purple-500 ring-1 ring-purple-200 dark:ring-purple-800"
                  : "border-gray-200 dark:border-gray-700",
              )}
            >
              {/* Compact Popular Badge */}
              {currentPlan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-md">
                    <Sparkles className="w-2.5 h-2.5 mr-1 inline" />
                    POPULAR
                  </div>
                </div>
              )}

              {/* Compact Savings Badge */}
              {currentPlan.savings && (
                <div className="absolute -top-1.5 -right-1.5">
                  <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md animate-pulse">
                    {currentPlan.savings}
                  </div>
                </div>
              )}

              {/* Compact Plan Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shadow-md",
                      currentPlan.badgeColor,
                    )}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight">{currentPlan.name}</h3>
                    <p className="text-xs text-muted-foreground">{currentPlan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black">{currentPlan.price}</span>
                    {currentPlan.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">{currentPlan.originalPrice}</span>
                    )}
                  </div>
                  {currentPlan.savings && (
                    <div className="text-xs font-bold text-green-600">Save {currentPlan.savings}</div>
                  )}
                </div>
              </div>

              {/* Compact Features - Show only top 3 */}
              <div className="space-y-2 mb-4">
                {currentPlan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs">{feature}</span>
                  </div>
                ))}
                {currentPlan.features.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{currentPlan.features.length - 3} more features
                  </div>
                )}
              </div>

              {/* Compact CTA Button */}
              <LoadingButton
                onClick={() => handlePlanSelect(currentPlan.id)}
                loading={isLoading && selectedPlan === currentPlan.id}
                disabled={isLoading}
                className={cn(
                  "w-full h-10 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm",
                  currentPlan.id === "free"
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : currentPlan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      : currentPlan.color === "gold"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white",
                )}
              >
                {currentPlan.id === "free" ? (
                  <>
                    <Droplets className="w-3 h-3 mr-1" />
                    Download with Watermark
                  </>
                ) : (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Get {currentPlan.name}
                  </>
                )}
              </LoadingButton>
            </div>
          </div>

          {/* Compact Quick Free Option */}
          {currentPlan.id !== "free" && (
            <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Or download with watermark</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFreeDownload}
                  disabled={isLoading}
                  className="text-xs h-6 px-2"
                >
                  Free
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden sm:block px-6">
          <div className="grid grid-cols-2 gap-3">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon
              const isSelected = selectedPlan === plan.id
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
                    plan.popular && "ring-2 ring-purple-500 ring-offset-2",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    plan.id === "free" &&
                      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50",
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", plan.badgeColor)}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">{plan.price}</span>
                      {plan.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through">{plan.originalPrice}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <LoadingButton
                    onClick={() => handlePlanSelect(plan.id)}
                    loading={isLoading && selectedPlan === plan.id}
                    disabled={isLoading}
                    className={cn(
                      "w-full text-xs h-8",
                      plan.id === "free"
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground",
                    )}
                  >
                    {plan.id === "free" ? "Free Download" : `Get ${plan.name}`}
                  </LoadingButton>
                </div>
              )
            })}
          </div>
        </div>

        {/* Compact Trust Indicators */}
        <div className="mt-4 px-3 sm:px-6 pb-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="font-medium text-green-700 dark:text-green-300">Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Instant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="font-medium text-purple-700 dark:text-purple-300">Quality</span>
              </div>
            </div>

            <div className="text-center mt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <Heart className="w-2.5 h-2.5 inline mr-1 text-red-500" />
                Trusted by 50,000+ creators
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
