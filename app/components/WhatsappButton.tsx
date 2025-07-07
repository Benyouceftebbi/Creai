"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { httpsCallable } from "firebase/functions"
import { functions } from "@/firebase/firebase"
import { useShop } from "../context/ShopContext"

interface AbridAIChatProps {
  className?: string
}

export function AbridAIChat({ className = "" }: AbridAIChatProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {shopData}=useShop()

  useEffect(() => {
    // Entrance animation delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    // Show tooltip after a delay (only if chat is not open)
    const tooltipTimer = setTimeout(() => {
      if (!isChatOpen) {
        setShowTooltip(true)
        // Hide tooltip after 3 seconds
        setTimeout(() => setShowTooltip(false), 3000)
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(tooltipTimer)
    }
  }, [isChatOpen])

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen)
    setShowTooltip(false)
    if (isChatOpen) {
      // Reset form when closing
      setIsSubmitted(false)
      setMessage("")
 
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)

   const submitMessage = httpsCallable(functions, "submitSupportMessage");
    await submitMessage({ shopId:shopData.id, message });

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleTooltipClose = () => {
    setShowTooltip(false)
  }

  return (
    <>
      {/* Chat Widget */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-16 opacity-0 scale-75"
        } ${className}`}
      >
        {/* Chat Interface */}
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-80 sm:w-96 mb-4 animate-in slide-in-from-bottom-4 duration-300">
            <Card className="shadow-2xl border-0 bg-white dark:bg-gray-900">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">AbridAI Support</CardTitle>
                      <p className="text-sm text-blue-100">How can we help you?</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleChatToggle}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        How can we help you?
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your question, feedback, or how we can assist you..."
                        required
                        className="w-full min-h-[100px] resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !message.trim() }
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Thank you for reaching out to AbridAI. We've received your message and will get back to you
                      shortly.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">We typically respond within 24 hours</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Button */}
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <button
            onClick={handleChatToggle}
            className={`
              relative group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white 
              rounded-full p-4 shadow-2xl transition-all duration-300 ease-out
              hover:scale-110 active:scale-95
              ${isHovered ? "shadow-blue-500/50" : "shadow-black/20"}
              ${isChatOpen ? "rotate-180" : ""}
            `}
            aria-label="Open AbridAI chat support"
          >
            {/* Pulse Animation */}
            {!isChatOpen && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
                <div className="absolute inset-0 rounded-full bg-purple-500 animate-pulse opacity-30"></div>
              </>
            )}

            {/* Chat Icon */}
            <div className="relative z-10">
              {isChatOpen ? (
                <X className="w-8 h-8 transition-transform duration-300" />
              ) : (
                <MessageCircle className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" />
              )}
            </div>

            {/* Notification Badge */}
            {!isChatOpen && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                <Bot size={12} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && !isChatOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ease-out ${
            showTooltip ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-xs relative">
            <button
              onClick={handleTooltipClose}
              className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1 transition-colors duration-200"
              aria-label="Close tooltip"
            >
              <X size={12} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium">Need help? Chat with AbridAI!</p>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">We typically reply within 24 hours</p>
            {/* Arrow pointing to button */}
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
