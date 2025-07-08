"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, Heart, Gift, Shield, X, Sparkles, Crown } from "lucide-react"
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

  const renderLowRatingOffer = () => (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center mx-auto">
          <Gift className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Thank you for your feedback!</h3>
        <p className="text-gray-600 dark:text-gray-300">We appreciate your honesty and want to make it right</p>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-800">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-600" />
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Special Recovery Offer</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-cyan-600">$5</span>
         
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div
                key="low-offer-feature-1"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>1,200 tokens included</span>
              </div>
              <div
                key="low-offer-feature-2"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span className="font-semibold">10 AI images instead of 6 !</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent money-back guarantee section */}
      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
          <Shield className="w-5 h-5 text-green-600" />
          <p className="font-semibold text-center">
            Not Satisfied? 100% Money Back Guarantee - This offer expires when you close this popup!
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <LoadingButton
          onClick={() => createCheckoutSession("price_1RiC4CDIpjCcuDeHuXfGFxyq")}
          loading={isLoading}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
        >
          Claim Offer
        </LoadingButton>
      </div>
    </div>
  )

  const renderHighRatingOffer = () => (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center mx-auto">
          <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Awesome! We're glad you loved it! 🎉</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Since you're enjoying our AI tools, here's an exclusive offer just for you
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-600 text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
          LIMITED TIME
        </div>

        <div className="text-center space-y-4 mt-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Exclusive Upgrade Offer</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-purple-600">$10</span>
             
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div
                key="high-offer-feature-1"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>2,400 tokens included</span>
              </div>
              <div
                key="high-offer-feature-2"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-semibold">20 AI images instead of 15!</span>
              </div>
              <div
                key="high-offer-feature-3"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Priority email support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent money-back guarantee section */}
  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
          <Shield className="w-5 h-5 text-green-600" />
          <p className="font-semibold text-center">
           Not satisfied? 100% Money Back Guarantee - This offer expires when you close this popup!
          </p>
        </div>
      </div>


      <div className="flex gap-3">
        <LoadingButton
          onClick={() => createCheckoutSession("price_1RBKk5DIpjCcuDeHpQhOI8gB")}
          loading={isLoading}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
        >
          Claim Exclusive Offer
        </LoadingButton>
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
      <DialogContent className={`${getModalSize()} max-h-[95vh] overflow-y-auto p-0 gap-0`}>
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="sr-only">Rate Your Experience</DialogTitle>
          </div>
        </DialogHeader>

        <div className={getModalHeight()}>
          {!showOffer && renderRatingScreen()}
          {showOffer && rating !== null && rating < 8 && renderLowRatingOffer()}
          {showOffer && rating !== null && rating >= 8 && renderHighRatingOffer()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
