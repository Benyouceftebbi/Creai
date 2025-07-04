"use client";
import { useAuth } from "@/app/context/AuthContext";
import { redirect } from "@/i18n/routing";
import { useLocale } from "next-intl";

import {usePathname} from "@/i18n/routing";
import { LoadingOverlay } from "../Auth/SignUp/page";
import React from "react";
import TopHeader from "@/components/ui/navigation/TopHeader";
import { ShopProvider} from "@/app/context/ShopContext";
import { WhatsAppSupport } from "@/app/components/WhatsappButton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {isAuthenticated,user} = useAuth();
  const locale = useLocale();

  const pathSegments = usePathname().split('/').filter(Boolean); // Update this line

  if (isAuthenticated==false) {
    return redirect({ href: "/Auth/SignIn", locale: locale });
  }
  if(isAuthenticated==undefined){
    return <LoadingOverlay/>
  }
  return ( 

  <ShopProvider userId={user.uid} userEmail={user.email}>


        <header className="flex h-16 shrink-0 items-center gap-2">

          <div className="ml-auto px-3">
            <TopHeader/>
          </div>
        </header>
      <main>

        {children}
 
      </main>

          {/* WhatsApp Support Button */}
      <WhatsAppSupport
        phoneNumber="+213561041724" // Replace with your actual WhatsApp number
        message="Hi! I need help with your SaaS platform. Can you assist me?"
      />
      </ShopProvider>


  );
}