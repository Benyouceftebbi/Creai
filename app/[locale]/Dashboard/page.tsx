"use client"

import { redirect } from "@/i18n/routing";




export default function Dashboard() {
redirect({
  href: "/dashboard/ai-creative",
  locale: "en", // or "fr", etc.
});
}


