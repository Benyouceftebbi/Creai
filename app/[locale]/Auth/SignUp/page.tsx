"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Eye, EyeOff, CheckCircle, Sparkles } from "lucide-react"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/app/context/AuthContext"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { PrivacyPolicy } from "./components/privacy-policy"
import { TermsConditions } from "./components/terms-conditions"
import { toast } from "@/hooks/use-toast"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/firebase/firebase"

// Country codes data
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+213", country: "DZ", flag: "🇩🇿" },
  { code: "+212", country: "MA", flag: "🇲🇦" },
  { code: "+216", country: "TN", flag: "🇹🇳" },
  { code: "+20", country: "EG", flag: "🇪🇬" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+7", country: "RU", flag: "🇷🇺" },
  { code: "+90", country: "TR", flag: "🇹🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+46", country: "SE", flag: "🇸🇪" },
  { code: "+47", country: "NO", flag: "🇳🇴" },
  { code: "+45", country: "DK", flag: "🇩🇰" },
]

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    countryCode: z.string().min(1, {
      message: "Please select a country code.",
    }),
    phoneNumber: z.string().min(6, {
      message: "Phone number must be at least 6 digits.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions.",
    }),
    promoCode: z.string().optional(),
    tokens: z.number().min(0, {
      message: "Tokens must be at least 0.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Full-screen loading overlay component
export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center">
      <svg
        className="animate-spin h-10 w-10 text-indigo-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Redirecting to dashboard...</p>
    </div>
  </div>
)

interface ModalProps {
  title: string
  message: string
  onClose: () => void
  isSuccess?: boolean
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose, isSuccess = false }) => {
  const [testPhoneNumber, setTestPhoneNumber] = useState("")
  const [isSendingSms, setIsSendingSms] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [phoneError, setPhoneError] = useState("")

  // Validate phone number format (basic validation)
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9]{6,15}$/
    return phoneRegex.test(phone)
  }

  const handleSendTestSms = async () => {
    setPhoneError("")
    if (!testPhoneNumber) {
      setPhoneError("Please enter a phone number")
      return
    }
    if (!isValidPhone(testPhoneNumber)) {
      setPhoneError("Please enter a valid phone number")
      return
    }

    setIsSendingSms(true)
    try {
      // Simulate SMS sending
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSmsSent(true)
    } catch (error) {
      setPhoneError("Failed to send test SMS. Please try again later.")
    } finally {
      setIsSendingSms(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
        {isSuccess && (
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Test SMS Delivery {smsSent && <span className="text-green-600 dark:text-green-400">(Completed)</span>}
              </h3>
              {!smsSent ? (
                <>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    You must send a test message before proceeding to the dashboard.
                  </p>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        value={testPhoneNumber}
                        onChange={(e) => setTestPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className="border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      />
                      {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                    </div>
                    <Button
                      type="button"
                      onClick={handleSendTestSms}
                      disabled={isSendingSms}
                      className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {isSendingSms ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Test message sent successfully!</p>
                    <p className="text-sm">Message sent to: {testPhoneNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            disabled={isSuccess && !smsSent}
            className={`${
              isSuccess && !smsSent ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white dark:bg-indigo-500 dark:hover:bg-indigo-600`}
          >
            {isSuccess ? "Go to Dashboard" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SignUp() {
  const t = useTranslations("signup")
  const { signup,googleSignup } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validatedPromoCode, setValidatedPromoCode] = useState<string | "">("")
  const [tokenAmount, setTokenAmount] = useState(50)
  const [promoApplied, setPromoApplied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      countryCode: "+1", // Default to USA
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      terms: false,
      promoCode: "",
      tokens: 120,
    
    },
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", message: "" })

  // Clean up loading state when component unmounts or route changes
  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  }, [])

  const handleGoogleSignUp = async () => {
 setGoogleLoading(true);
  const result = await googleSignup();
     if (result === "new") {
        router.push("/dashboard/ai-creative")
    } else if (result === "existing") {
       router.push("/dashboard/ai-creative")
    }
    setGoogleLoading(false);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Combine country code and phone number
    const fullPhoneNumber = values.countryCode + values.phoneNumber
    const submitData = {
      ...values,
        createdAt: new Date(),
      phoneNumber: fullPhoneNumber,
    }

    const user = await signup(submitData)
    if (user) {
      console.log("Sign up successful")
      setModalContent({
        title: "Account Created Successfully!",
        message: "Your account has been created. You must send a test SMS before proceeding to the dashboard.",
      })
      //setIsModalOpen(true)
      router.push("/dashboard/ai-creative")
      return
    } else {
      console.error("Sign up error:")
      setModalContent({
        title: "Sign Up Error",
        message: "An error occurred during sign up. Please try again.",
      })
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    if (modalContent.title.includes("Success")) {
      setIsLoading(true)
      setIsModalOpen(false)
      router.push("/dashboard/ai-creative")
    } else {
      setIsModalOpen(false)
    }
  }

  const handleApplyPromoCode = () => {
    const promoCode = form.getValues("promoCode")

      setTokenAmount(200)
      setValidatedPromoCode("")
      form.setValue("tokens", 200)
      form.setValue("promoCode", "")
      setPromoApplied(true)
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      {isLoading && <LoadingOverlay />}
      <div className="max-w-2xl w-full relative z-10">
        <Link
          href="/Auth/SignIn"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 group transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 transform transition-transform group-hover:-translate-x-1" />
          {t("backToSignIn")}
        </Link>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/20">
          {/* Header */}
          <div className="text-center p-8 pb-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Creative AI
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("createAccount")}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t("getStarted")}</p>
          </div>

          <div className="px-8 pb-8">
            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full mb-6 py-3.5 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {googleLoading ? "Creating account..." : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  or continue with email
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold">
                          {t("firstName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-gray-300 dark:border-gray-600 focus:ring-indigo-500 bg-white dark:bg-gray-900"
                            placeholder="John"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold">{t("email")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="border-gray-300 dark:border-gray-600 focus:ring-indigo-500 bg-white dark:bg-gray-900"
                            placeholder="john@example.com"
                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Number with Country Code */}
                  <div className="md:col-span-2">
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      {t("phoneNumber")}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-indigo-500 bg-white dark:bg-gray-900">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60">
                                {countryCodes.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    <div className="flex items-center gap-2">
                                      <span>{country.flag}</span>
                                      <span>{country.code}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="border-gray-300 dark:border-gray-600 focus:ring-indigo-500 bg-white dark:bg-gray-900"
                                placeholder="123456789"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold">
                          {t("password")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              className="border-gray-300 dark:border-gray-600 focus:ring-indigo-500 pr-10 bg-white dark:bg-gray-900"
                              placeholder="••••••••"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-semibold">
                          {t("confirmPassword")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              className="border-gray-300 dark:border-gray-600 focus:ring-indigo-500 pr-10 bg-white dark:bg-gray-900"
                              placeholder="••••••••"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Promo Code Section */}
              {/* <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-2">
                    {t("promoCodeSectionTitle")}
                  </h3>
                  <FormField
                    control={form.control}
                    name="promoCode"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("promoCodePlaceholder")}
                              className="border-gray-300 dark:border-gray-600 focus:ring-indigo-500 bg-white dark:bg-gray-900"
                              disabled={promoApplied}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 bg-transparent"
                            onClick={handleApplyPromoCode}
                            disabled={promoApplied}
                          >
                            {t("applyPromoCode")}
                          </Button>
                        </div>
                        {promoApplied && (
                          <div className="mt-2">
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {validatedPromoCode
                                ? `${t("promoCodeApplied", { promoCode: validatedPromoCode, tokenAmount: tokenAmount })}`
                                : `Invalid promo code`}
                            </p>
                            <Button
                              type="button"
                              variant="link"
                              className="text-xs text-indigo-600 p-0 h-auto mt-1"
                              onClick={() => {
                                setPromoApplied(false)
                                form.setValue("promoCode", "")
                              }}
                            >
                              {t("tryDifferentCode")}
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */} 

                {/* Terms and Conditions */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                          {t("termsAgreement")}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              setShowTerms(true)
                            }}
                            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline mx-1"
                          >
                            {t("termsLink")}
                          </button>
                          {t("and")}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              setShowPrivacyPolicy(true)
                            }}
                            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline mx-1"
                          >
                            {t("privacyLink")}
                          </button>
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <LoadingButton
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  loading={form.formState.isSubmitting}
                >
                  {t("createAccountButton")}
                </LoadingButton>
              </form>
            </Form>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              <p className="text-gray-600 dark:text-gray-300">
                {t("alreadyHaveAccount")}
                <Link
                  href="/Auth/SignIn"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors ml-1"
                >
                  {t("signIn")}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <Modal
            title={modalContent.title}
            message={modalContent.message}
            onClose={handleCloseModal}
            isSuccess={modalContent.title.includes("Success")}
          />
        )}

        <PrivacyPolicy open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy} />
        <TermsConditions open={showTerms} onOpenChange={setShowTerms} />
      </div>
    </div>
  )
}
