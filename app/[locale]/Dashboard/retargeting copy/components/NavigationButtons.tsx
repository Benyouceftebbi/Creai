import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { RetargetingCampaignHook } from '../types';
import { useTranslations } from 'next-intl';

type NavigationButtonsProps = {
  campaign: RetargetingCampaignHook;
  currentStep: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onClose: () => void;
};

export function NavigationButtons({ 
  campaign,
  currentStep,
  onPrevStep,
  onNextStep,
  onClose
}: NavigationButtonsProps) {
  const t = useTranslations('retargeting');

  return (
    <motion.div 
      className="fixed bottom-6 right-6 flex justify-end items-center space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button 
        onClick={onPrevStep} 
        disabled={currentStep === 0}
        variant="outline"
      >
        {t('previous')}
      </Button>

      {currentStep < 3 ? (
        <Button onClick={onNextStep}>
          {t('next')}
        </Button>
      ) : (
        <AlertDialog open={campaign.isAlertOpen} onOpenChange={campaign.setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button>{t('sendCampaign')}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('sendCampaignQuestion')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('sendCampaignDescription', {
                  messageCount: campaign.messageCount,
                  recipients: campaign.selectedGroup.recipients,
                  group: campaign.selectedGroup.label,
                  totalMessages: campaign.messageCount * campaign.selectedGroup.recipients,
                  totalCost: campaign.totalCost.toLocaleString(),
                  costPerMessage: campaign.CHARACTER_LIMIT
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={async () => {
                  await campaign.handleSendCampaign();
                  onClose();
                }} 
                disabled={campaign.isSending}
              >
                {campaign.isSending ? (
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    {t('sending')}
                  </motion.div>
                ) : (
                  t('sendCampaign')
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
}
