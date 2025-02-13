import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CampaignIdeasCarousel } from "../campaign-ideas/CampaignIdeasCarousel";
import type { RetargetingCampaignHook } from "../../types";
import { useTranslations } from "next-intl";

type CraftMessageProps = {
  campaign: RetargetingCampaignHook;
};

export function CraftMessage({ campaign }: CraftMessageProps) {
  const t = useTranslations("retargeting");

  const showPersonalizationTip =
    campaign.audienceSource === "excel" &&
    campaign.excelData?.nameColumn &&
    !campaign.message.includes("{{name}}");

  const renderValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 overflow-hidden"
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{t("campaignIdeas")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("selectTemplateOrCreate")}
        </p>
        <CampaignIdeasCarousel
          onSelectIdea={(idea) => campaign.setMessage(renderValue(idea))}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="message" className="block text-sm font-medium">
            {t("retargetingMessage")}
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("bestPractices")}</p>
                <ul className="list-disc pl-4 mt-2">
                  <li>{t("conciseAndClear")}</li>
                  <li>{t("useNamePlaceholder")}</li>
                  <li>{t("strongCTA")}</li>
                  <li>{t("highlightValue")}</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {showPersonalizationTip && (
          <Alert>
            <AlertDescription>
              {t("personalizationTip")}
            </AlertDescription>
          </Alert>
        )}

        <Textarea
          id="message"
          placeholder={t("messagePlaceholder")}
          value={renderValue(campaign.message)}
          onChange={(e) => campaign.setMessage(e.target.value)}
          rows={4}
          className="w-full resize-none"
        />

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{t("charactersRemaining", { count: renderValue(campaign.remainingCharacters) })}</span>
          <span>
            {t("messageCount", {
              count: renderValue(campaign.messageCount),
            })} × {renderValue(campaign.totalRecipients)} {t("recipients")}
          </span>
        </div>

        <Progress
          value={
            ((
              (Number(campaign.CHARACTER_LIMIT) -
                Number(campaign.remainingCharacters)) /
              Number(campaign.CHARACTER_LIMIT)
            ) * 100) || 0
          }
        />

        <p className="text-sm text-muted-foreground">
          {t("estimatedCost", { value: renderValue(campaign.totalCost?.toLocaleString()) })} DZD
        </p>
      </div>
    </motion.div>
  );
}
