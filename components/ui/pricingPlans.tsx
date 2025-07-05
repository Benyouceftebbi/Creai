"use client"

import { CheckCircle2, Sparkles, Crown, Zap, Star } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useShop } from "@/app/context/ShopContext"
import { collection, addDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Define the 3 simple price tiers
const priceTiers = [
  {
    id: "price_1RBKk5DIpjCcuDeHpQhOI8gB",
    name: "Starter",
    price: 10,
    tokens: "2,400",
    icon: Sparkles,
    color: "blue",
    features: ["2,400 tokens included", "16 AI images or 2 videos", "Basic enhancement", "Email support"],
  },
  {
    id: "price_1ffffVZG89v",
    name: "Pro",
    price: 30,
    tokens: "7,200",
    icon: Crown,
    color: "purple",
    popular: true,
    features: ["7,200 tokens included", "48 AI images or 7 videos", "Advanced tools", "Priority support"],
  },
  {
    id: "price_1RBKlXDIpjCcuDeHZJVZG89v",
    name: "Enterprise",
    price: 80,
    tokens: "19,200",
    icon: Zap,
    color: "green",
    features: ["19,200 tokens included", "128 AI images or 19 videos", "All premium features", "24/7 support"],
  },
]

export function PricingPlans({ className }: { className?: string }) {
  const [selectedTierIndex, setSelectedTierIndex] = useState(1) // Default to Pro plan (index 1)
  const [hoveredTier, setHoveredTier] = useState<number | null>(null)
  const t = useTranslations("billing")
  const { shopData } = useShop()
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const createCheckoutSession = async (planId: string) => {
    const selectedTier = priceTiers.find((tier) => tier.id === planId)
    if (!selectedTier) return

    setLoadingStates((prev) => ({ ...prev, [planId]: true }))

    try {
      const checkoutSessionRef = collection(db, "Customers", shopData.id, "checkout_sessions")
      const docRef = await addDoc(checkoutSessionRef, {
        mode: "payment",
        price: selectedTier.id,
        success_url: window.location.href,
        cancel_url: window.location.href,
        allow_promotion_codes: true,
        client_reference_id: `${shopData.id}-${selectedTier.id}`,
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
          setLoadingStates((prev) => ({ ...prev, [planId]: false }))
          unsubscribe()
        }

        if (url) {
          window.location.assign(url)
          setLoadingStates((prev) => ({ ...prev, [planId]: false }))
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
      setLoadingStates((prev) => ({ ...prev, [planId]: false }))
    }
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Compact Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 px-3 py-1 rounded-full mb-3">
          <Star className="h-3 w-3 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Choose Your Plan</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unlock Your Creative Potential</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Start creating amazing content today</p>
      </div>

      {/* Compact Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {priceTiers.map((tier, index) => {
          const IconComponent = tier.icon
          return (
            <div
              key={tier.id}
              data-popular={tier.popular}
              className={cn(
                "relative bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all duration-300 hover:shadow-lg transform hover:scale-105 cursor-pointer flex flex-col h-full",
                tier.popular
                  ? "border-purple-300 dark:border-purple-500 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/50"
                  : "border-gray-200 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-600",
              )}
              onClick={() => setSelectedTierIndex(index)}
              onMouseEnter={() => setHoveredTier(index)}
              onMouseLeave={() => setHoveredTier(null)}
            >
              {tier.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}

              {/* Icon and Title */}
              <div className="text-center mb-3">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 shadow-md transition-all duration-300",
                    tier.color === "blue" && "bg-gradient-to-br from-blue-500 to-cyan-600",
                    tier.color === "purple" && "bg-gradient-to-br from-purple-500 to-pink-600",
                    tier.color === "green" && "bg-gradient-to-br from-emerald-500 to-teal-600",
                    hoveredTier === index && "scale-110",
                  )}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span
                    className={cn(
                      "text-2xl font-bold bg-gradient-to-br bg-clip-text text-transparent",
                      tier.color === "blue" && "from-blue-500 to-cyan-600",
                      tier.color === "purple" && "from-purple-500 to-pink-600",
                      tier.color === "green" && "from-emerald-500 to-teal-600",
                    )}
                  >
                    ${tier.price}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">+ VAT</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 mb-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{tier.tokens} tokens</p>
                </div>
              </div>

              {/* Compact Features */}
              <ul className="space-y-2 mb-4 flex-1">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
                        tier.color === "blue" && "bg-gradient-to-br from-blue-500 to-cyan-600",
                        tier.color === "purple" && "bg-gradient-to-br from-purple-500 to-pink-600",
                        tier.color === "green" && "bg-gradient-to-br from-emerald-500 to-teal-600",
                      )}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Compact CTA Button */}
              <LoadingButton
                onClick={() => createCheckoutSession(tier.id)}
                loading={loadingStates[tier.id] || false}
                className={cn(
                  "w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm",
                  tier.popular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
                    : tier.color === "blue"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-md"
                      : tier.color === "green"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600",
                )}
              >
                Get Started
              </LoadingButton>
            </div>
          )
        })}
      </div>

      {/* Compact Footer */}
      <div className="text-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>150 tokens = 1 image</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-600" />
            <span>1,000 tokens = 1 video</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-purple-600 dark:text-purple-400">
          <Star className="w-3 h-3" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  )
}
