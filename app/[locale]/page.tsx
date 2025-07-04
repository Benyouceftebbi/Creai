"use client"
import { ChevronRight, Star } from "lucide-react"
import { HeroWithMediaBackground } from "../components/Ai-Images/hero-with-media-background"
import { BeforeAfterShowcase } from "../components/Ai-Images/before-after-showcase"
import { CreativeAIFeatures } from "../components/Ai-Images/creative-ai-features"
import { CreativeAIPricing } from "../components/Ai-Images/creative-ai-pricing"
import { CreativeAITestimonials } from "../components/Ai-Images/creative-ai-testimonials"
import { CreativeAINavbar } from "../components/Ai-Images/creative-ai-navbar"
import { CreativeAIFooter } from "../components/Ai-Images/creative-ai-footer"
import { CreativeAIStats } from "../components/Ai-Images/creative-ai-stats"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export default function CreativeAIPage() {
  const t = useTranslations("creativeAi")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50/30 dark:from-gray-900 dark:to-gray-800">
      <CreativeAINavbar />

      {/* Hero Section with Media Background */}
      <section id="hero" className="relative">
        <HeroWithMediaBackground />
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-20">
        <CreativeAIStats />
      </section>

      {/* Before/After Showcase */}
      <section
        id="showcase"
        className="py-12 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800"
      >
        <BeforeAfterShowcase />
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900"
      >
        <CreativeAIFeatures />
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-b from-white to-purple-50/30 dark:from-gray-900 dark:to-gray-800"
      >
        <CreativeAIPricing />
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-b from-purple-50/30 to-white dark:from-gray-800 dark:to-gray-900"
      >
        <CreativeAITestimonials />
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Star className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Join 50,000+ Creators</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Creative Process?</h2>

          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Creative AI to bring their wildest ideas to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/Auth/SignIn"
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl"
            >
              Start Creating Now
              <ChevronRight className="h-5 w-5" />
            </Link>
            <button className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      <CreativeAIFooter />
    </div>
  )
}
