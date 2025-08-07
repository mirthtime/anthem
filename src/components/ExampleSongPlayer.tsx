import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExampleSongPlayerProps {
  title: string;
  subtitle: string;
  duration: string;
  audioUrl: string;
  index: number;
}

export const ExampleSongPlayer = ({ title, subtitle, duration, audioUrl, index }: ExampleSongPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setAudioDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
    >
      <Card className="bg-gradient-card border-border hover:border-primary/30 interactive-card cursor-pointer group overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Button
                size="sm"
                onClick={togglePlay}
                className="w-12 h-12 rounded-lg bg-gradient-sunset hover:bg-gradient-sunset/90 group-hover:scale-110 transition-transform duration-300 p-0"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white ml-0.5" />
                )}
              </Button>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground truncate mb-2">
                {subtitle}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-sunset transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Volume2 className="h-4 w-4" />
              <span>
                {isPlaying && audioDuration > 0 
                  ? `${formatTime(currentTime)} / ${formatTime(audioDuration)}`
                  : duration
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </motion.div>
  );
};