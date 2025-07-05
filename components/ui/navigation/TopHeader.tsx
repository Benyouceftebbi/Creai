"use client"

import { RefreshCw, Star, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/app/components/ThemeToggle"
import { useState } from "react"
import { useShop } from "@/app/context/ShopContext"
import { useAuth } from "@/app/context/AuthContext"
import { PricingModal } from "../pricingModal"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/firebase"
import { useTranslations } from "next-intl"
import LanguageSwitcher from "@/app/components/LanguageSwitcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const { shopData, setShopData } = useShop()
  const { logout, user } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const t = useTranslations("header")

  // Format tokens to 2 decimal places
  const formattedTokens = (shopData.tokens || 0).toFixed(2)

  const refreshTokens = async () => {
    setIsRefreshing(true)
    try {
      const docRef = await getDoc(doc(db, "Shops", shopData.id))
      const newTokens = docRef.data()?.tokens || 0
      setShopData((prev: any) => ({ ...prev, tokens: newTokens }))
    } catch (error) {
      console.error("Error refreshing tokens:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Enhanced Refresh Tokens Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={refreshTokens}
        className={`
          relative overflow-hidden p-0 h-8 w-8 
          hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25
          transition-all duration-300 ease-out
          ${isRefreshing ? "animate-spin scale-110 shadow-lg shadow-blue-500/25" : ""}
        `}
        disabled={isRefreshing}
      >
        <RefreshCw className="h-4 w-4" />
        <span className="sr-only">{t("refresh-tokens")}</span>
      </Button>

      {/* Enhanced Tokens Display */}
      <div className="font-medium text-muted-foreground flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200/50 dark:border-yellow-800/30">
        <Star className="h-4 w-4 text-yellow-500 fill-current animate-pulse" />
        <span className="font-bold text-foreground tabular-nums">{formattedTokens}</span>
        <span className="text-xs text-muted-foreground hidden sm:inline">tokens</span>
        <span className="sr-only">{t("tokens")}</span>
      </div>

      <div className="h-5 w-px bg-border/60" />

      {/* Clean User Profile Dropdown - No Auto Animation */}
      <DropdownMenu onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`
              relative overflow-hidden group
              h-9 px-3 rounded-xl
              hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 
              dark:hover:from-purple-950/30 dark:hover:to-blue-950/30
              hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105
              transition-all duration-500 ease-out
              flex items-center gap-2.5
              border border-transparent hover:border-purple-200/50 dark:hover:border-purple-800/30
            `}
          >
            <Avatar
              className={`h-7 w-7 relative z-10 ring-2 ring-transparent group-hover:ring-purple-200 dark:group-hover:ring-purple-800 transition-all duration-300`}
            >
              <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-purple-700 dark:text-purple-300 font-bold">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:block relative z-10 text-left">
              <span className="text-sm font-semibold truncate max-w-24 block text-foreground">
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email?.length > 20 ? `${user.email.substring(0, 20)}...` : user?.email || "user@example.com"}
              </span>
            </div>

            <ChevronDown
              className={`
                h-3.5 w-3.5 relative z-10 transition-all duration-500 ease-out
                group-hover:rotate-180 group-hover:text-purple-600 dark:group-hover:text-purple-400
                ${isDropdownOpen ? "rotate-180" : ""}
              `}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64 rounded-2xl shadow-2xl border-border/50 bg-background/95 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-200"
          align="end"
          sideOffset={12}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 px-4 py-3 text-left bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-t-2xl">
              <Avatar className="h-12 w-12 ring-2 ring-purple-200 dark:ring-purple-800">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-purple-700 dark:text-purple-300 font-bold text-lg">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-bold text-foreground text-base">{user?.displayName || "User"}</span>
                <span className="truncate text-sm text-muted-foreground">{user?.email || "user@example.com"}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Enhanced Tokens Display in Dropdown */}
          <DropdownMenuItem className="px-4 py-3 cursor-default focus:bg-transparent hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-amber-50/50 dark:hover:from-yellow-950/20 dark:hover:to-amber-950/20">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 rounded-lg">
                <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 fill-current" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground tabular-nums text-lg">{formattedTokens}</div>
                <div className="text-xs text-muted-foreground">Available tokens</div>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Clean Logout Button - No Auto Animation */}
          <DropdownMenuItem
            onClick={handleLogout}
            className={`
              px-4 py-3 cursor-pointer rounded-b-2xl
              text-red-600 dark:text-red-400 font-medium
              hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 
              dark:hover:from-red-950/30 dark:hover:to-orange-950/30
              hover:text-red-700 dark:hover:text-red-300
              focus:bg-gradient-to-r focus:from-red-50 focus:to-orange-50 
              dark:focus:from-red-950/30 dark:focus:to-orange-950/30
              focus:text-red-700 dark:focus:text-red-300
              transition-all duration-300 ease-out
            `}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <LogOut className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t("logout") || "Log out"}</div>
                <div className="text-xs text-muted-foreground">Sign out of your account</div>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-5 w-px bg-border/60" />

      <PricingModal />
      <ThemeToggle />
      <LanguageSwitcher />
    </div>
  )
}
