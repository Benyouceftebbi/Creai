"use client"

import type * as React from "react"
import { Command, Home, MessageSquare, Settings, Target, Brain, Squirrel,IceCreamCone, Sparkles, Bot  } from "lucide-react"

import { NavMain } from "@/components/ui/navigation/nav-main"
import { NavUser } from "@/components/ui/navigation/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { usePathname } from "@/i18n/routing"
import { useShop } from "@/app/context/ShopContext"
import { useTranslations } from "next-intl"
import { ShopSwitcher } from "./shop-switcher"
import { NavSecondaryWithDialogs } from "./nav-secondary"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname().split("/").filter(Boolean)
  const { shopData } = useShop()
  const { shops } = useShop()
  const t = useTranslations("sidebar")

  const data = {
    teams: [
      {
        name: "Colitrack",
        logo: Command,
        plan: t("platform"),
      },
    ],
    user: {
      name: shopData.shopName,
      email: shopData.email,
      avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
      {
        url: "/dashboard/ai-creative",
        icon: Sparkles,
        isActive: pathname[1] === "Creative Ai ",
         isSpecial: true,
    gradient: "from-purple-500 via-pink-500 to-orange-500",
          title: "Creative AI",
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ShopSwitcher teams={shops} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondaryWithDialogs className="mt-auto" />
        <NavUser user={data.user} shopData={shopData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
