"use client"
import { useEffect, useState } from "react"
import { TrendingUp, Users, Zap, Star,Target } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    number: "90%",
    label: "Cheaper",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    icon: Target,
    number: "99%",
    label: "Pricised",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Zap,
    number: "99.9%",
    label: "Uptime",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "User Rating",
    gradient: "from-orange-500 to-red-600",
  },
]

export function CreativeAIStats() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 mx-4 sm:mx-6 lg:mx-8">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>

              <div
                className={`text-3xl lg:text-4xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2`}
              >
                {stat.number}
              </div>

              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm lg:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
