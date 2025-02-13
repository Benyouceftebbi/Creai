import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ProgressSteps } from "./ProgressSteps"
import { SelectAudience } from "./steps/SelectAudience"
import { CraftMessage } from "./steps/CraftMessage"
import { PreviewAndTest } from "./steps/PreviewAndTest"
import { SendCampaign } from "./steps/SendCampaign"
import { NavigationButtons } from "./NavigationButtons"
import { useRetargetingCampaign } from "../hooks/useRetargetingCampaign"
import { STEPS } from "./constants"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import type { SentMessage } from "../types"

type CampaignDialogProps = {
  onClose: () => void
  onAddCampaign: (newMessage: SentMessage) => void
}

export function CampaignDialog({ onClose, onAddCampaign }: CampaignDialogProps) {
  const campaign = useRetargetingCampaign()

  const renderStepContent = () => {
    switch (campaign.currentStep) {
      case 0:
        return <SelectAudience campaign={campaign} />
      case 1:
        return <CraftMessage campaign={campaign} />
      case 2:
        return <PreviewAndTest campaign={campaign} />
      case 3:
        return <SendCampaign />
      default:
        return null
    }
  }

  const handleSendCampaign = async () => {
    const newMessage = await campaign.handleSendCampaign()
    if (newMessage) {
      onAddCampaign(newMessage)
      onClose()
    }
  }

  const t = useTranslations("retargeting")
  return (
    <DialogContent className="max-w-[90%] md:max-w-[1150px] w-full h-[800px] p-0 pb-16">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>{t("createRetargetingCampaign")}</DialogTitle>
        <DialogDescription>{t("followSteps")}</DialogDescription>
      </DialogHeader>

      <div className="p-6 pt-2 h-[calc(100%-80px)] flex flex-col">
        <ProgressSteps steps={STEPS} currentStep={campaign.currentStep} />
        <AnimatePresence mode="wait">
          <motion.div
            key={campaign.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <NavigationButtons
        campaign={campaign}
        currentStep={campaign.currentStep}
        onPrevStep={() => campaign.setCurrentStep((prev) => Math.max(prev - 1, 0))}
        onNextStep={() => campaign.setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))}
        onClose={onClose}
        onSendCampaign={handleSendCampaign}
      />
    </DialogContent>
  )
}

