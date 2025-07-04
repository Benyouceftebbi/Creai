"use client"
import { Star, Quote } from "lucide-react"
import { Link } from "@/i18n/routing"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    company: "Creative Studio",
    content:
      "Creative AI has completely transformed my workflow. What used to take hours now takes minutes, and the quality is absolutely stunning.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Marcus Rodriguez",
    role: "Content Creator",
    company: "Social Media Agency",
    content:
      "The before/after transformations are mind-blowing. My clients are amazed by the professional results we can achieve so quickly.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Emily Watson",
    role: "Photographer",
    company: "Freelance",
    content:
      "As a photographer, Creative AI has opened up entirely new creative possibilities. The style transfer feature is pure magic.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
]

export function CreativeAITestimonials() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-purple-100/80 dark:bg-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Loved by Creators</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">What Our Users Say</h2>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Join thousands of creators who are already transforming their creative process
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20 dark:border-gray-700/20"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
              ))}
            </div>

            <Quote className="w-10 h-10 text-purple-200 dark:text-purple-600/20 mb-4" />

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{testimonial.content}</p>

            <div className="flex items-center gap-4">
              <img
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Join Our Creative Community?</h3>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Start creating amazing content today and see why thousands of creators choose Creative AI
          </p>
          <Link
            href="/Auth/SignIn"
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Creating Now
          </Link>
        </div>
      </div>
    </div>
  )
}
