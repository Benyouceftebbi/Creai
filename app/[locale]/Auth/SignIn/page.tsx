"use client"
import type React from "react"
import { useState } from "react"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react"
import { Link, useRouter } from "@/i18n/routing"
import { useAuth } from "../../../context/AuthContext"
import { useTranslations } from "next-intl"
import { LoadingButton } from "@/components/ui/LoadingButton"
import { toast } from "@/hooks/use-toast"
import { sendPasswordResetEmail, signInWithPopup,GoogleAuthProvider, getAdditionalUserInfo  } from "firebase/auth"
import { auth, db, provider } from "@/firebase/firebase"
import { doc, setDoc } from "firebase/firestore"


const GoogleIcon = () => (
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
)

export default function SignIn() {
  const t = useTranslations("signin")
  const { login,googleSignup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [isRemembered, setIsRemembered] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const logged = await login(email, password, isRemembered)
      if (logged === true) {
       router.push("/dashboard/ai-creative")
      } else {
        setError(true)
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login Error:", error)
      setError(true)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

const handleGoogleSignIn = async () => {
  setGoogleLoading(true);
  const result = await googleSignup();
     if (result === "new") {
        router.push("/dashboard/ai-creative")
    } else if (result === "existing") {
        router.push("/dashboard/ai-creative")
    }
    setGoogleLoading(false);
  
};

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      })
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Password Reset Error:", error)
      toast({
        title: "Error",
        description: "An error occurred while sending the password reset email.",
        variant: "destructive",
      })
    }
  }

  const inputClassName = (hasError: boolean) => `
    w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border rounded-xl
    focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400
    text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
    transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600
    ${hasError ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400" : "border-gray-300 dark:border-gray-700"}
  `

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 group transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 transform transition-transform group-hover:-translate-x-1" />
            {t("backToHome")}
          </Link>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white text-lg" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Creative AI
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("welcomeBack")}</h1>
              <p className="text-gray-600 dark:text-gray-300">{t("signInToContinue")}</p>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("emailAddress")}
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      error ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    className={inputClassName(error)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("password")}
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      error ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClassName(error)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-indigo-600 dark:text-indigo-400 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700"
                    checked={isRemembered}
                    onChange={() => setIsRemembered(!isRemembered)}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    {t("rememberMe")}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  {t("forgotPassword")}
                </button>
              </div>

              <LoadingButton
                loading={loading}
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {t("signIn")}
              </LoadingButton>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-3.5 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                {t("dontHaveAccount")}{" "}
                <Link
                  href="/Auth/SignUp"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                >
                  {t("signUp")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20 dark:border-gray-700/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("checkYourEmail")}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{t("checkSpam")}</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
