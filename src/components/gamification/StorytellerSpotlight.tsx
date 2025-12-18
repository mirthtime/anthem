import { motion } from 'framer-motion';
import { Mic2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Traveler } from '@/types';

interface StorytellerSpotlightProps {
  storyteller?: Traveler;
  dayNumber: number;
  tripTitle: string;
}

export const StorytellerSpotlight = ({
  storyteller,
  dayNumber,
  tripTitle
}: StorytellerSpotlightProps) => {
  if (!storyteller) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="relative overflow-hidden border-0"
        style={{
          background: `linear-gradient(135deg, ${storyteller.color}15 0%, ${storyteller.color}05 50%, transparent 100%)`
        }}
      >
        {/* Decorative Elements */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: storyteller.color }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: storyteller.color }}
        />

        <CardContent className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="relative"
            >
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-5xl md:text-6xl shadow-xl"
                style={{
                  backgroundColor: storyteller.color + '30',
                  border: `3px solid ${storyteller.color}`
                }}
              >
                {storyteller.avatar}
              </div>
              {/* Mic Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
                className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
              >
                <Mic2 className="h-5 w-5 text-primary-foreground" />
              </motion.div>
            </motion.div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-3"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Day {dayNumber} Storyteller
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold mb-2"
              >
                {storyteller.name}'s Turn
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground"
              >
                Capturing today's memories for{' '}
                <span className="text-foreground font-medium">{tripTitle}</span>
              </motion.p>
            </div>

            {/* Visual Flair */}
            <motion.div
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:flex flex-col items-center gap-2"
            >
              <div className="text-6xl">🎵</div>
              <div className="text-xs text-muted-foreground text-center">
                Today's anthem<br />awaits
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
