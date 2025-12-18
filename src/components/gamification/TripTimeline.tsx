import { motion } from 'framer-motion';
import { Check, Music, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TripDay } from '@/types';

interface TripTimelineProps {
  days: TripDay[];
  onPlaySong: (songId: string) => void;
}

export const TripTimeline = ({ days, onPlaySong }: TripTimelineProps) => {
  return (
    <Card className="premium-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Trip Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          {/* Days */}
          <div className="space-y-4">
            {days.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Timeline Node */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    day.isComplete
                      ? 'bg-emerald-500/20 border-2 border-emerald-500'
                      : day.isToday
                      ? 'bg-primary/20 border-2 border-primary animate-pulse'
                      : 'bg-muted border-2 border-border'
                  }`}
                >
                  {day.isComplete ? (
                    <Check className="h-5 w-5 text-emerald-500" />
                  ) : day.isToday ? (
                    <span className="text-xl">{day.storyteller.avatar}</span>
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 p-3 rounded-lg transition-all ${
                    day.isToday
                      ? 'bg-primary/10 border border-primary/30'
                      : day.isComplete
                      ? 'bg-muted/50'
                      : 'bg-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Day {day.dayNumber}</span>
                      {day.isToday && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: day.storyteller.color + '30' }}
                    >
                      {day.storyteller.avatar}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {day.storyteller.name}
                    </span>

                    {day.isComplete && day.songId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto h-7 gap-1 text-xs"
                        onClick={() => onPlaySong(day.songId!)}
                      >
                        <Play className="h-3 w-3" />
                        Play
                      </Button>
                    )}
                  </div>

                  {day.notes.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {day.notes.length} moment{day.notes.length !== 1 ? 's' : ''} captured
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
