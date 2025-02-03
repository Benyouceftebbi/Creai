import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CampaignIdeasCarousel } from '../campaign-ideas/CampaignIdeasCarousel';
import type { RetargetingCampaignHook } from '../../types';

type CraftMessageProps = {
  campaign: RetargetingCampaignHook;
};

export function CraftMessage({ campaign }: CraftMessageProps) {
  const showPersonalizationTip = campaign.audienceSource === 'excel' && 
    campaign.excelData?.nameColumn && 
    !campaign.message.includes('{{name}}');

  const renderValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
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
        <h3 className="text-lg font-semibold">Campaign Ideas</h3>
        <p className="text-sm text-muted-foreground">
          Select a template or create your own message
        </p>
        <CampaignIdeasCarousel onSelectIdea={(idea) => campaign.setMessage(renderValue(idea))} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="message" className="block text-sm font-medium">
            Retargeting Message
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Best practices for retargeting messages:</p>
                <ul className="list-disc pl-4 mt-2">
                  <li>Keep it concise and clear</li>
                  <li>Use {'{{name}}'} for personalization</li>
                  <li>Include a strong call-to-action</li>
                  <li>Highlight unique value propositions</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {showPersonalizationTip && (
          <Alert>
            <AlertDescription>
              Tip: You can personalize your message by using {'{{name}}'} - it will be replaced with each customer's name
            </AlertDescription>
          </Alert>
        )}

        <Textarea
          id="message"
          placeholder="Type your retargeting message here... Use {{name}} to personalize the message"
          value={renderValue(campaign.message)}
          onChange={(e) => campaign.setMessage(e.target.value)}
          rows={4}
          className="w-full resize-none"
        />

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{renderValue(campaign.remainingCharacters)} characters remaining</span>
          <span>
            {renderValue(campaign.messageCount)} message
            {renderValue(campaign.messageCount) !== 1 ? 's' : ''} × 
            {renderValue(campaign.totalRecipients)} recipients
          </span>
        </div>

        <Progress 
          value={((Number(campaign.CHARACTER_LIMIT) - Number(campaign.remainingCharacters)) / Number(campaign.CHARACTER_LIMIT) * 100) || 0}
        />

        <p className="text-sm text-muted-foreground">
          Estimated total cost: {renderValue(campaign.totalCost?.toLocaleString())} DZD
        </p>
      </div>
    </motion.div>
  );
}