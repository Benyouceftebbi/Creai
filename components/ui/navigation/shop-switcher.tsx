"use client"
import { ChevronsUpDown, Command } from "lucide-react"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useShop } from "@/app/context/ShopContext"


export function ShopSwitcher() {
  const { isMobile } = useSidebar()
  const { shopData, shops, setShopData } = useShop()

  // If no shop data is available, don't render anything
  if (!shopData) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>

            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{shopData.companyName}</span>
                <span className="truncate text-xs">sender ID: {shopData.senderId || "Colitrack"}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}