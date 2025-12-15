import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Download,
  ListMusic,
  ChevronDown,
  Music
} from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { cn } from '@/lib/utils';
import { downloadSong } from '@/utils/download';
import { toast } from '@/hooks/use-toast';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullScreenPlayer = ({ isOpen, onClose }: FullScreenPlayerProps) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    favorites,
    toggleFavorite,
    queue
  } = useAudio();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRepeatClick = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const handleDownload = async () => {
    if (!currentSong.audio_url) {
      toast({
        title: "No Audio Available",
        description: "This song doesn't have audio to download yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      await downloadSong(currentSong.audio_url, currentSong.title);
      toast({
        title: "Download Started",
        description: `Downloading "${currentSong.title}"...`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the song. Please try again.",
        variant: "destructive",
      });
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <div className="h-full flex flex-col relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
              <motion.div
                className="absolute w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  left: '-400px',
                  top: '-400px',
                }}
              />
            </div>

            {/* Header */}
            <div className="relative z-10 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <ChevronDown className="h-6 w-6" />
                </Button>

                <h2 className="text-sm font-medium text-muted-foreground">
                  NOW PLAYING
                </h2>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowQueue(!showQueue)}
                  className="rounded-full"
                >
                  <ListMusic className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 relative z-10">
              {/* Album Art */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative mb-8"
              >
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-2xl overflow-hidden">
                  {currentSong.artwork_url ? (
                    <img
                      src={currentSong.artwork_url}
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-24 h-24 text-primary/40" />
                    </div>
                  )}
                </div>

                {/* Spinning vinyl effect when playing */}
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                    }}
                  />
                )}
              </motion.div>

              {/* Song Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8 max-w-md"
              >
                <h1 className="text-3xl font-bold mb-2">{currentSong.title}</h1>
                <p className="text-lg text-muted-foreground mb-1">{currentSong.stop_name}</p>
                {currentSong.people && (
                  <p className="text-sm text-muted-foreground/70">with {currentSong.people}</p>
                )}
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md mb-4"
              >
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={(value) => seek(value[0])}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 mb-8"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleShuffle}
                  className={cn(
                    "rounded-full",
                    isShuffle && "text-primary"
                  )}
                >
                  <Shuffle className="h-5 w-5" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={previous}
                  className="rounded-full"
                >
                  <SkipBack className="h-6 w-6" />
                </Button>

                <Button
                  size="icon"
                  onClick={isPlaying ? pause : play}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                  disabled={!currentSong.audio_url}
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7 text-white" />
                  ) : (
                    <Play className="h-7 w-7 text-white ml-1" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={next}
                  className="rounded-full"
                >
                  <SkipForward className="h-6 w-6" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleRepeatClick}
                  className={cn(
                    "rounded-full",
                    repeatMode !== 'none' && "text-primary"
                  )}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="h-5 w-5" />
                  ) : (
                    <Repeat className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>

              {/* Additional Controls */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleFavorite(currentSong.id)}
                  className={cn(
                    "rounded-full",
                    favorites.has(currentSong.id) && "text-red-500"
                  )}
                >
                  <Heart className={cn(
                    "h-5 w-5",
                    favorites.has(currentSong.id) && "fill-current"
                  )} />
                </Button>

                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    className="rounded-full"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>

                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-popover rounded-lg shadow-lg"
                      >
                        <div className="h-24 flex items-center">
                          <Slider
                            value={[isMuted ? 0 : volume * 100]}
                            max={100}
                            step={1}
                            onValueChange={(value) => setVolume(value[0] / 100)}
                            className="h-24"
                            orientation="vertical"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button size="icon" variant="ghost" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>

                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full"
                  onClick={handleDownload}
                  disabled={!currentSong.audio_url}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Queue Sidebar */}
            <AnimatePresence>
              {showQueue && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute right-0 top-0 h-full w-80 bg-background/95 backdrop-blur-lg border-l border-border p-6 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Queue</h3>
                    <span className="text-sm text-muted-foreground">
                      {queue.songs.length} songs
                    </span>
                  </div>

                  <div className="space-y-2">
                    {queue.songs.map((song, index) => (
                      <div
                        key={song.id}
                        className={cn(
                          "p-3 rounded-lg transition-colors",
                          index === queue.currentIndex
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <h4 className="font-medium text-sm truncate">{song.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {song.stop_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};