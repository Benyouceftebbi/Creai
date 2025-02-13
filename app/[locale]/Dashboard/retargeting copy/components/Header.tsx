import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type HeaderProps = {
  token?: string;
  senderId?: string;
};

export function Header({ token, senderId }: HeaderProps) {
  const t = useTranslations('retargeting');
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold mb-2 neon-text">{t('retargetingCampaign')}</h1>
          <Button 
            variant="outline" 
            size="icon" 
            aria-label={t('help')}
            className="neon-hover"
          >
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground">
        {t('createCustomMessages')}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{t('token')}:</span>
            <code className="px-2 py-1 bg-muted rounded text-sm">
              {token ? `${token.slice(0, 8)}...${token.slice(-8)}` : t('notAvailable')}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{t('senderId')}:</span>
            <code className="px-2 py-1 bg-muted rounded text-sm">
              {senderId ||  t('notAvailable')}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}