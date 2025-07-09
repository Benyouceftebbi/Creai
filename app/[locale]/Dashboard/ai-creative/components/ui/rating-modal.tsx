"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, Heart, Gift, Shield, X, Sparkles, Crown, AlertTriangle, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useShop } from "@/app/context/ShopContext"
import { collection, addDoc, onSnapshot } from "firebase/firestore"
import { db, functions } from "@/firebase/firebase"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { toast } from "@/hooks/use-toast"
import { httpsCallable } from "firebase/functions"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RatingModal({ isOpen, onClose }: RatingModalProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [showOffer, setShowOffer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("creativeAi")
  const { shopData } = useShop()

const handleRatingSubmit = async () => {
   if (rating !== null) {
    
    const submitRating = httpsCallable(functions, "submitRating");

    try {
      await submitRating({ shopId:shopData.id,rating });
      setShowOffer(true);
    } catch (error) {
      console.error("❌ Error submitting rating:", error);
      // Optional: toast or UI error
    }
  }
}

  const createCheckoutSession = async (planId: string) => {
    setIsLoading(true)
    try {
      const checkoutSessionRef = collection(db, "Customers", shopData.id, "checkout_sessions")
      const docRef = await addDoc(checkoutSessionRef, {
        mode: "payment",
        price: planId,
        success_url: window.location.href,
        cancel_url: window.location.href,
        allow_promotion_codes: true,
        client_reference_id: `${shopData.id}-${planId}`,
        opened:true

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

  const handleClose = () => {
    setRating(null)
    setHoveredRating(null)
    setShowOffer(false)
    setIsLoading(false)
    onClose()
  }

  const renderRatingScreen = () => (
    <div className="text-center space-y-6 sm:space-y-8 p-6 sm:p-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            How was your experience?
          </h3>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Your feedback helps us improve our AI creative tools
          </p>
        </div>
      </div>

      {/* Mobile-optimized rating stars */}
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-5 sm:flex sm:justify-center gap-2 sm:gap-3 max-w-lg mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starValue) => (
            <button
              key={`rating-star-${starValue}`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(null)}
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation",
                (hoveredRating !== null ? starValue <= hoveredRating : rating !== null && starValue <= rating)
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md",
              )}
            >
              <Star
                className={cn(
                  "w-6 h-6 sm:w-7 sm:h-7",
                  (hoveredRating !== null ? starValue <= hoveredRating : rating !== null && starValue <= rating)
                    ? "fill-current"
                    : "",
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <span className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300">
              {hoveredRating || rating || 0}/10
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleRatingSubmit}
        disabled={rating === null}
        size="lg"
        className="w-full sm:w-auto sm:min-w-48 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Submit Rating
      </Button>
    </div>
  )




  const renderHighRatingOffer = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-slate-800 dark:to-pink-900/20 rounded-xl shadow-inner border border-purple-100 dark:border-purple-800/30 m-2 sm:m-4">
      {/* Simplified background elements for mobile */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-12 h-12 bg-purple-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-pink-400 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Reduced floating elements for mobile */}
      <div className="absolute top-3 left-3 text-lg animate-bounce">🎉</div>
      <div className="absolute top-3 right-3 text-sm animate-pulse">✨</div>

      <div className="relative z-10 p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Compact Header Section */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto shadow-lg transform -rotate-3">
              <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
            </div>

          </div>
          <div className="space-y-1">
            <h3 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">
              Happy you loved
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                your ad!
              </span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Let's unlock <span className="font-bold text-purple-600">20 more immages</span> — just for today
            </p>
          </div>
        </div>

        {/* Compact Offer Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-sm opacity-20"></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 shadow-xl border border-purple-100 dark:border-purple-800/30">
            {/* Compact Price Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full shadow-lg">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-bold text-xs">EXCLUSIVE TODAY</span>
                </div>
              </div>
            </div>

            <div className="pt-3 space-y-3 sm:space-y-4">
              {/* Compact Price */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    $10
                  </span>
                  <div className="text-left">
                    <div className="text-xs text-slate-500 line-through">$25</div>
                    <div className="text-xs font-bold text-green-600">60% OFF</div>
                  </div>
                </div>
              </div>

              {/* Simplified Features */}
              <div className="space-y-2">
                {[
                  { icon: "🎨", text: "20 AI Ad Images", highlight: true },
                  { icon: "⚡", text: "2,400 Tokens" },
                  { icon: "🎁", text: "Bonus: +5 Extra Ads", highlight: true },
                  { icon: "🚀", text: "Instant delivery" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {feature.icon}
                    </div>
                    <span
                      className={`text-xs sm:text-sm ${feature.highlight ? "font-bold text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Guarantee */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
            <div className="text-center">
              <p className="font-bold text-green-800 dark:text-green-300 text-xs">100% Money-Back Guarantee</p>
            </div>
          </div>
        </div>
 <p className="text-center text-xs italic text-slate-500 dark:text-slate-400">
        Offer expires when you close this popup
          </p>
        {/* Compact CTA */}
        <div className="space-y-2">
          <LoadingButton
            onClick={() => createCheckoutSession("price_1RBKk5DIpjCcuDeHpQhOI8gB")}
            loading={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white text-sm sm:text-base py-3 px-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ✨ Yes, Unlock 20 Ads Now
          </LoadingButton>
          <p className="text-center text-xs italic text-slate-500 dark:text-slate-400">
            "Generate stunning creatives in seconds"
          </p>
        </div>
      </div>
    </div>
  )

  const renderLowRatingOffer = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-red-900/20 rounded-xl shadow-inner border border-red-100 dark:border-red-800/30 m-2 sm:m-4">
      {/* Simplified background for mobile */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.3),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Compact Header Section */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto shadow-lg transform rotate-3">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-xs">😕</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">
              Not fully satisfied?
              <br />
              <span className="text-red-500">Let's fix that.</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              We'll create <span className="font-bold text-red-500">10 new ads</span> for just{" "}
              <span className="font-bold">$5</span>
            </p>
          </div>
        </div>

        {/* Compact Offer Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur-sm opacity-20"></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 shadow-xl border border-red-100 dark:border-red-800/30">
            {/* Compact Price Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span className="font-bold text-xs">RECOVERY OFFER</span>
                </div>
              </div>
            </div>

            <div className="pt-3 space-y-3 sm:space-y-4">
              {/* Compact Price */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    $5
                  </span>
                  <div className="text-left">
                    <div className="text-xs text-slate-500 line-through">$15</div>
                    <div className="text-xs font-bold text-green-600">67% OFF</div>
                  </div>
                </div>
              </div>

              {/* Simplified Features */}
              <div className="space-y-2">
                {[
            { icon: "🎨", text: "10 AI Ad Images", highlight: true },
                  { icon: "⚡", text: "Delivered instantly" },
                  { icon: "🔒", text: "No credit card stored" },
                  { icon: "🎯", text: "Targeted improvements" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-orange-500 rounded-md flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {feature.icon}
                    </div>
                    <span
                      className={`text-xs sm:text-sm ${feature.highlight ? "font-bold text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

 <p className="text-center text-xs italic text-slate-500 dark:text-slate-400">
        Offer expires when you close this popup
          </p>
        {/* Compact Guarantee */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
            <div className="text-center">
              <p className="font-bold text-green-800 dark:text-green-300 text-xs">100% Money-Back Guarantee</p>
            </div>
          </div>
        </div>



        {/* Compact CTA */}
        <div className="space-y-2">
          <LoadingButton
            onClick={() => createCheckoutSession("price_1RiC4CDIpjCcuDeHuXfGFxyq")}
            loading={isLoading}
            className="w-full bg-gradient-to-r from-red-500 via-red-600 to-orange-600 hover:from-red-600 hover:via-red-700 hover:to-orange-700 text-white text-sm sm:text-base py-3 px-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            💪 Yes, Improve My Ad Now
          </LoadingButton>
          <p className="text-center text-xs italic text-slate-500 dark:text-slate-400">
            "We'll fix your ad and help you get results"
          </p>
        </div>
      </div>
    </div>
  )

  // Dynamic modal size based on content
  const getModalSize = () => {
    if (!showOffer) {
      // Large size for rating screen
      return "sm:max-w-lg lg:max-w-2xl xl:max-w-3xl"
    } else {
      // Smaller size for offer screens
      return "sm:max-w-md"
    }
  }

  const getModalHeight = () => {
    if (!showOffer) {
      // Larger height for rating screen
      return "min-h-[400px] sm:min-h-[500px]"
    } else {
      // Auto height for offer screens
      return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Rate Your Experience</DialogTitle>
        </DialogHeader>

        <div className="max-h-[85vh] overflow-y-auto">
    
          {renderLowRatingOffer()}

        </div>
      </DialogContent>
    </Dialog>
  )
}
