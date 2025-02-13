import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CampaignCard } from './CampaignCard';

const CAMPAIGN_IDEAS = [
  {
    title: "Flash Sale Alert",
    message: "🔥 24-Hour Flash Sale! Get 30% off on all products. Use code FLASH30. Limited time only! Shop now at [Store URL]. Don't miss out on these amazing deals!"
  },
  {
    title: "Abandoned Cart Reminder",
    message: "Hey! We noticed you left some items in your cart. They're still waiting for you! Complete your purchase now and get 10% off with code COMEBACK10."
  },
  {
    title: "New Collection Launch",
    message: "📢 Just Dropped! Our new collection is here. Be the first to shop our latest styles. Early birds get 20% off with code EARLY20. Visit [Store URL] now!"
  },
  {
    title: "Customer Appreciation",
    message: "Thank you for being a valued customer! Enjoy an exclusive 15% discount on your next purchase. Use code THANKS15. Valid for 48 hours only!"
  },
  {
    title: "Back in Stock",
    message: "Good news! The item you wanted is back in stock 🎉 Shop now before it's gone again. Use code BACK10 for 10% off your purchase!"
  }
] as const;

type CampaignIdeasCarouselProps = {
  onSelectIdea: (message: string) => void;
};

export function CampaignIdeasCarousel({ onSelectIdea }: CampaignIdeasCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -containerWidth : containerWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll('left')}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div 
        ref={scrollRef}
        className="grid grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory px-1 py-3 hide-scrollbar"
        style={{
          gridAutoFlow: 'column',
          gridAutoColumns: '1fr',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {CAMPAIGN_IDEAS.map((idea, index) => (
          <div key={idea.title} className="snap-start">
            <CampaignCard
              idea={idea}
              index={index}
              onSelect={onSelectIdea}
            />
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll('right')}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}