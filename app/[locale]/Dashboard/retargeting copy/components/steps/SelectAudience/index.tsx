"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ClientGroupSelector } from "./ClientGroupSelector"
import { ExcelFileUploader } from "./ExcelFileUploader"
import type { RetargetingCampaignHook } from "../../../types"
import { useTranslations } from "next-intl"

type SelectAudienceProps = {
  campaign: RetargetingCampaignHook
}

export function SelectAudience({ campaign }: SelectAudienceProps) {
  const t = useTranslations("retargeting")

  const [totalRecipients, setTotalRecipients] = useState(0)
  const [estimatedCost, setEstimatedCost] = useState(0)

  useEffect(() => {
    setTotalRecipients(campaign.totalRecipients)
    setEstimatedCost(campaign.totalCost)
  }, [campaign.totalRecipients, campaign.totalCost])

  useEffect(() => {
    setTotalRecipients(0)
    setEstimatedCost(0)

    if (campaign.audienceSource === "group") {
      campaign.selectedClientGroup = null
    } else {
      campaign.excelFile = null
    }
  }, [campaign.audienceSource])

  const handleAudienceSourceChange = (value: "group" | "excel") => {
    campaign.setAudienceSource(value)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-semibold">{t("campaignDetails")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("tokenPerSMS")}: {campaign.CHARACTER_LIMIT} DZD
            </p>
          </div>
          <div>
            <p className="text-sm">{t("totalRecipients")}: {totalRecipients}</p>
            <p className="text-sm">{t("estimatedCost")}: {estimatedCost.toLocaleString()} DZD</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <Label>{t("selectAudienceSource")}</Label>
            <RadioGroup
              value={campaign.audienceSource}
              onValueChange={handleAudienceSourceChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group">{t("selectClientGroup")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel">{t("uploadExcelFile")}</Label>
              </div>
            </RadioGroup>
          </div>

          {campaign.audienceSource === "group" ? (
            <ClientGroupSelector campaign={campaign} />
          ) : (
            <ExcelFileUploader campaign={campaign} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
