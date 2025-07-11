"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Crown, Check, X, Sparkles, Shield, Zap, Star, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { collection, addDoc, onSnapshot } from "firebase/firestore"
import { db, functions } from "@/firebase/firebase"
import { useShop } from "@/app/context/ShopContext"
import { toast } from "@/hooks/use-toast"
import { httpsCallable } from "firebase/functions"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageIndex?: number
  totalImages?: number
  onDownloadWithWatermark: (imageUrl: string, filename: string) => void
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
  },
  {
    id: "single",
    name: "Single Image",
    price: "$0.99",
    originalPrice: null,
    description: "This image without watermark",
    features: ["No watermark", "High quality", "Commercial license", "Instant download"],
    icon: Star,
    color: "blue",
    popular: false,
    priceId: "price_single_image", // Replace with actual Stripe price ID
  },
  {
    id: "pack3",
    name: "3 Images Pack",
    price: "$2.99",
    originalPrice: "$3.99",
    description: "3 watermark-free downloads",
    features: ["3 download credits", "No watermarks", "High quality", "Commercial license", "Valid for 30 days"],
    icon: Zap,
    color: "purple",
    popular: true,
    priceId: "price_3_images_pack", // Replace with actual Stripe price ID
  },
  {
    id: "pack12",
    name: "12 Images Pack",
    price: "$5.00",
    originalPrice: "$12.99",
    description: "12 watermark-free downloads",
    features: [
      "12 download credits",
      "No watermarks",
      "High quality",
      "Commercial license",
      "Valid for 60 days",
      "Priority support",
    ],
    icon: Crown,
    color: "gold",
    popular: false,
    priceId: "price_12_images_pack", // Replace with actual Stripe price ID
  },
]

export function DownloadModal({
  isOpen,
  onClose,
  imageUrl,
  imageIndex = 0,
  totalImages = 1,
  onDownloadWithWatermark,
}: DownloadModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { shopData } = useShop()
  const t = useTranslations("creativeAi")

  const handleFreeDownload = async () => {
    setIsLoading(true)
    try {
      // Add watermark via Firebase function
      const addWatermark = httpsCallable(functions, "addWatermarkToImage")
      const result = await addWatermark({
        imageUrl: imageUrl,
        shopId: shopData.id,
      })

      if (result.data?.success && result.data?.watermarkedUrl) {
        const filename = `watermarked_image_${Date.now()}.png`
        onDownloadWithWatermark(result.data.watermarkedUrl, filename)
        toast({
          title: "Download Started",
          description: "Your watermarked image is downloading...",
        })
        onClose()
      } else {
        throw new Error("Failed to add watermark")
      }
    } catch (error) {
      console.error("Error adding watermark:", error)
      toast({
        title: "Download Failed",
        description: "Could not process watermark. Please try again.",
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
        success_url: window.location.href,
        cancel_url: window.location.href,
        allow_promotion_codes: true,
        client_reference_id: `${shopData.id}-${priceId}`,
        metadata: {
          imageUrl: imageUrl,
          imageIndex: imageIndex.toString(),
          downloadType: "premium",
        },
      })

      // Listen for the checkout session URL
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">🎨 Ready to download?</DialogTitle>
                <p className="text-sm text-muted-foreground">Choose your preferred download option</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-2">
          {/* Image Preview */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 mb-6 border">
            <div className="flex items-center justify-center">
              <img
                src={imageUrl || "/placeholder.svg?height=200&width=300"}
                alt="Preview"
                className="max-w-full max-h-48 object-contain rounded-lg shadow-md"
              />
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                Image {imageIndex + 1} of {totalImages}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon
              const isSelected = selectedPlan === plan.id

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg",
                    plan.popular && "ring-2 ring-purple-500 ring-offset-2",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    plan.id === "free" &&
                      "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50",
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          plan.color === "gray" && "bg-gray-100 dark:bg-gray-800",
                          plan.color === "blue" && "bg-blue-100 dark:bg-blue-900/50",
                          plan.color === "purple" && "bg-purple-100 dark:bg-purple-900/50",
                          plan.color === "gold" && "bg-yellow-100 dark:bg-yellow-900/50",
                        )}
                      >
                        <IconComponent
                          className={cn(
                            "w-4 h-4",
                            plan.color === "gray" && "text-gray-600 dark:text-gray-400",
                            plan.color === "blue" && "text-blue-600 dark:text-blue-400",
                            plan.color === "purple" && "text-purple-600 dark:text-purple-400",
                            plan.color === "gold" && "text-yellow-600 dark:text-yellow-400",
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-lg">{plan.price}</span>
                        {plan.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">{plan.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
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
                      "w-full text-sm",
                      plan.id === "free"
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground",
                    )}
                  >
                    {plan.id === "free" ? (
                      <>
                        <Droplets className="w-4 h-4 mr-2" />
                        Download with Watermark
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Get Premium Download
                      </>
                    )}
                  </LoadingButton>
                </div>
              )
            })}
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>Commercial License</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
