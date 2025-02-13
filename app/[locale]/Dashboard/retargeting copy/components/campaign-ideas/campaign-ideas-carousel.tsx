import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl'

const CAMPAIGN_IDEAS = [
  "Special discount for returning customers",
  "New product launch announcement",
  "Limited time offer",
  "Seasonal promotion",
  "Customer appreciation event"
];

type CampaignIdeasCarouselProps = {
  onSelectIdea: (idea: string) => void;
};

export function CampaignIdeasCarousel({ onSelectIdea }: CampaignIdeasCarouselProps) {
  const t = useTranslations('retargeting')

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {CAMPAIGN_IDEAS.map((idea, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex-shrink-0"
        >
          <Card 
            className="w-64 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectIdea(idea)}
          >
            <CardContent className="p-4">
              <p className="text-sm">{idea}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}