import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CampaignIdea } from '../../types';

type CampaignCardProps = {
  idea: CampaignIdea;
  index: number;
  onSelect: (message: string) => void;
};

export function CampaignCard({ idea, index, onSelect }: CampaignCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card 
        className="h-full cursor-pointer hover:shadow-lg transition-all hover:scale-105"
        onClick={() => onSelect(idea.message)}
      >
        <CardHeader className="p-3">
          <CardTitle className="text-sm">{idea.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-muted-foreground line-clamp-4">{idea.message}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}