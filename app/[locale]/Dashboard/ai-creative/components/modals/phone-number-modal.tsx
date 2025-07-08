"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Shield, Gift } from "lucide-react"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { useTranslations } from "next-intl"

interface PhoneNumberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (phoneNumber: string) => void
  isLoading?: boolean
}

const countryCodes = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+420", country: "Czech Rep.", flag: "🇨🇿" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+967", country: "Yemen", flag: "🇾🇪" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
]

export function PhoneNumberModal({ isOpen, onClose, onSubmit, isLoading = false }: PhoneNumberModalProps) {
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")
  const t = useTranslations("creativeAi")

  const handleSubmit = () => {
    if (phoneNumber.trim()) {
      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/^\+/, "")}`
      onSubmit(fullPhoneNumber)
    }
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "") // Only allow digits
    setPhoneNumber(value)
  }

  const isValid = phoneNumber.length >= 7 && phoneNumber.length <= 15

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Almost Ready! 🎉
          </DialogTitle>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Please provide your phone number to access your generated content
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Secure & Private</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Your number is encrypted and protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Exclusive Updates</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Get notified about new AI features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-4">
            <Label htmlFor="phone-input" className="text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </Label>

            <div className="flex gap-2">
              {/* Country Code Selector */}
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {countryCodes.map((country) => (
                    <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span className="font-mono text-sm">{country.code}</span>
                        <span className="text-xs text-gray-500">{country.country}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Phone Number Input */}
              <Input
                id="phone-input"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="1234567890"
                className="flex-1"
                maxLength={15}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Format: {countryCode}
                {phoneNumber || "1234567890"}
              </span>
              <span>{phoneNumber.length}/15</span>
            </div>
          </div>

          {/* Submit Button */}
          <LoadingButton
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? "Saving..." : "Continue to Results"}
          </LoadingButton>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By continuing, you agree to receive important updates about your AI creations
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
