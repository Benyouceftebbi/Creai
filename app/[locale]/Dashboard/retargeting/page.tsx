"use client"
import { useState } from "react"
import { Header } from "./components/Header"
import { MessageHistory } from "./components/MessageHistory"
import { CampaignDialog } from "./components/CampaignDialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useRetargetingCampaign } from "./hooks/useRetargetingCampaign"
import { useTranslations } from "next-intl"
import type { SentMessage } from "./types"

export default function RetargetingCampaign() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([])
  const { exportToExcel } = useRetargetingCampaign()
  const t = useTranslations("retargeting")

  const handleAddCampaign = (newMessage: SentMessage) => {
    setSentMessages((prev) => [newMessage, ...prev])
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <Header />

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold neon-text">{t("messageHistory")}</h2>
          <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <DialogTrigger asChild>
              <Button variant="neon">{t("createNewCampaign")}</Button>
            </DialogTrigger>
            <CampaignDialog onClose={() => setIsPopupOpen(false)} onAddCampaign={handleAddCampaign} />
          </Dialog>
        </div>

        <MessageHistory sentMessages={sentMessages} exportToExcel={exportToExcel} />
      </div>
    </div>
  )
}

