import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RetargetingCampaignHook } from "../../../types"
import { useTranslations } from "next-intl"

type ClientGroupSelectorProps = {
  campaign: RetargetingCampaignHook
}

export function ClientGroupSelector({ campaign }: ClientGroupSelectorProps) {
  const t = useTranslations("retargeting")

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>{t("deliveryStatusLabel")}</Label>
        <RadioGroup
          value={campaign.deliveryStatus}
          onValueChange={(value) => campaign.setDeliveryStatus(value as "delivered" | "not-delivered" | "all")}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivered" id="delivered" />
            <Label htmlFor="delivered">{t("deliveredMessagesOnly")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-delivered" id="not-delivered" />
            <Label htmlFor="not-delivered">{t("notDeliveredMessagesOnly")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">{t("allMessages")}</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>{t("timePeriodLabel")}</Label>
         <Select 
          value={campaign.selectedGroup.value}
          onValueChange={(value) => {
            const group = campaign.CLIENT_GROUPS.find(g => g.value === value);
            if (group) campaign.setSelectedGroup(group);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {campaign.CLIENT_GROUPS.map((group) => (
              <SelectItem key={group.value} value={group.value}>
                {group.label} ({group.recipients} recipients)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

