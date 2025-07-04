"use client"
import { useState } from "react"
import { Sparkles, Zap, Brain, Palette, ImageIcon, Video, Wand2, Target } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

const features = [
  {
    icon: Brain,
    title: "Advanced AI Models",
    description: "Powered by cutting-edge AI technology for stunning results",
    gradient: "from-purple-500 to-indigo-600",
    delay: "0ms",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional content in seconds, not hours",
    gradient: "from-blue-500 to-cyan-600",
    delay: "100ms",
  },
  {
    icon: Palette,
    title: "Style Transfer",
    description: "Apply any artistic style to your images instantly",
    gradient: "from-pink-500 to-rose-600",
    delay: "200ms",
  },
  {
    icon: ImageIcon,
    title: "Image Enhancement",
    description: "Upscale, restore, and enhance any image with AI",
    gradient: "from-emerald-500 to-teal-600",
    delay: "300ms",
  },
  {
    icon: Video,
    title: "Video Generation",
    description: "Create stunning video content from text prompts",
    gradient: "from-orange-500 to-red-600",
    delay: "400ms",
  },
  {
    icon: Wand2,
    title: "Magic Editing",
    description: "Remove objects, change backgrounds, add elements",
    gradient: "from-violet-500 to-purple-600",
    delay: "500ms",
  },
  {
    icon: Target,
    title: "Precision Control",
    description: "Fine-tune every aspect with advanced parameters",
    gradient: "from-indigo-500 to-blue-600",
    delay: "600ms",
  },
  {
    icon: Sparkles,
    title: "Creative Filters",
    description: "Transform your content with artistic filters",
    gradient: "from-cyan-500 to-blue-600",
    delay: "700ms",
  },
]

export function CreativeAIFeatures() {
  const t = useTranslations("creativeAiFeatures")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-purple-100/80 dark:bg-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Powerful Features</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Everything You Need to Create
        </h2>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Unlock your creative potential with our comprehensive suite of AI-powered tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
            style={{ animationDelay: feature.delay }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
            />

            {/* Icon */}
            <div
              className={`relative w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 ${hoveredIndex === index ? "scale-110 rotate-3" : ""}`}
            >
              <feature.icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              {feature.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>

            {/* Hover Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <Link
          href="/Auth/SignIn"
          className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Ready to explore all features?</span>
        </Link>
      </div>
    </div>
  )
}
