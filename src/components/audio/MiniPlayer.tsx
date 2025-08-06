
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipForward,
  ChevronUp,
  ChevronDown,
  MapPin,
  Users,
  Heart,
  Maximize2
} from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface MiniPlayerProps {
  onExpand?: () => void;
  className?: string;
}

export const MiniPlayer = ({ onExpand, className }: MiniPlayerProps) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    next,
    seek,
    favorites,
    toggleFavorite
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className={`fixed bottom-4 right-4 z-50 ${className}`}
    >
      <Card className="w-80 bg-gradient-card border-border shadow-card backdrop-blur-sm">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-lg overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Main Content */}
            <div className="flex items-center gap-3">
              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{currentSong.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{currentSong.stop_name}</span>
                  {currentSong.people && (
                    <>
                      <span>•</span>
                      <Users className="h-3 w-3" />
                      <span className="truncate">{currentSong.people}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(currentSong.id)}
                  className={`h-8 w-8 ${favorites.has(currentSong.id) ? 'text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(currentSong.id) ? 'fill-current' : ''}`} />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={isPlaying ? pause : play}
                  className="h-8 w-8"
                  disabled={!currentSong.audio_url}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button size="sm" variant="ghost" onClick={next} className="h-8 w-8">
                  <SkipForward className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>

                {onExpand && (
                  <Button size="sm" variant="ghost" onClick={onExpand} className="h-8 w-8">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 overflow-hidden"
                >
                  {/* Progress Slider */}
                  <div className="space-y-1">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={(value) => seek(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Song Details */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {currentSong.genre}
                    </Badge>
                    {currentSong.stories && (
                      <p className="text-xs text-muted-foreground italic truncate max-w-[200px]">
                        "{currentSong.stories}"
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
