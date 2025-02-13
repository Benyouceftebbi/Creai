import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function SendCampaign() {
  const t = useTranslations('retargeting');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center space-y-4"
    >
      <h3 className="text-2xl font-semibold">{t('readytoSendYourCampaign')}</h3>
      <p className="text-center text-muted-foreground">
       {t('reviewyourmessageandaudienceonelasttimebeforesending')}
      </p>
    </motion.div>
  );
}