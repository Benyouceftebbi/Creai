"use client"
import { Check, Sparkles, Crown, Zap } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import { Link } from "@/i18n/routing"

const plans = [
  {
    name: "Starter",
    price: 10,
    credits: 2400,
    icon: Sparkles,
    gradient: "from-blue-500 to-cyan-600",
    features: [
      "2,400 tokens included",
      "16 AI image generations OR 2 video creations",
      "Basic image enhancement",
      "Standard resolution output",
      "Email support",
      "Commercial license",
    ],
  },
  {
    name: "Pro",
    price: 30,
    credits: 7200,
    icon: Crown,
    gradient: "from-purple-500 to-pink-600",
    popular: true,
    features: [
      "7,200 tokens included",
      "48 AI image generations OR 7 video creations",
      "Advanced editing tools",
      "High resolution output",
      "Priority support",
      "Commercial license",
      "Custom style training",
      "Batch processing",
    ],
  },
  {
    name: "Enterprise",
    price: 80,
    credits: 19200,
    icon: Zap,
    gradient: "from-emerald-500 to-teal-600",
    features: [
      "19,200 tokens included",
      "128 AI image generations OR 19 video creations",
      "All premium features",
      "Ultra-high resolution",
      "24/7 dedicated support",
      "Extended commercial license",
      "API access",
      "Custom integrations",
      "Team collaboration",
    ],
  },
]

export function CreativeAIPricing() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/Auth/SignIn")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-purple-100/80 dark:bg-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Choose Your Plan</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Unlock Your Creative Potential
        </h2>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Start creating amazing content today with our flexible pricing plans
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-500 hover:scale-105 ${
              plan.popular
                ? "border-purple-300 dark:border-purple-500 shadow-2xl shadow-purple-500/20 scale-105"
                : "border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-2xl"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}

            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl mb-4 shadow-lg`}
              >
                <plan.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>

              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className={`text-4xl font-bold bg-gradient-to-br ${plan.gradient} bg-clip-text text-transparent`}>
                  ${plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">+ VAT</span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.credits.toLocaleString()} tokens
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.floor(plan.credits / 150)} images or {Math.floor(plan.credits / 1000)} videos
                </p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-5 h-5 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center`}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/Auth/SignIn"
              className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-center block ${
                plan.popular
                  ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl`
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
  <div className="bg-blue-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Usage Guide</h3>
    <div className="flex flex-col md:flex-row justify-between gap-6 text-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">AI Image Generation</p>
          <p className="text-gray-600 dark:text-gray-400">150 tokens per image</p>
        </div>
      </div>
      <div className="flex items-center gap-3 md:ml-auto">
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">AI Video Creation</p>
          <p className="text-gray-600 dark:text-gray-400">1,000 tokens per video</p>
        </div>
      </div>
    </div>
  </div>

  <p className="text-gray-600 dark:text-gray-400 mb-4">
    All plans include commercial licensing and priority support
  </p>
  <div className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
    <Sparkles className="w-4 h-4" />
    <span>30-day money-back guarantee</span>
  </div>
</div>

    </div>
  )
}
