import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Song } from '@/types';
import { 
  Play, 
  Pause, 
  Music, 
  ImageIcon, 
  Loader2, 
  RotateCcw, 
  Users, 
  Clock,
  Waves,
  Share2,
  Download
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useArtwork } from '@/hooks/useArtwork';
import { SongSharingDropdown } from '@/components/sharing/SongSharingDropdown';
import { downloadSong } from '@/utils/download';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SongCardProps {
  song: Song;
  onPlay?: () => void;
  onPause?: () => void;
  onRegenerate?: (song: Song) => void;
  isPlaying?: boolean;
}

export const SongCard = ({ 
  song, 
  onPlay, 
  onPause, 
  onRegenerate,
  isPlaying = false 
}: SongCardProps) => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [internalPlaying, setInternalPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { generateSongArtwork, loading: artworkLoading } = useArtwork();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => setInternalPlaying(false);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  const handlePlayPause = async () => {
    if (!audioRef.current || !song.audio_url) return;

    try {
      if (currentlyPlaying) {
        audioRef.current.pause();
        setInternalPlaying(false);
        onPause?.();
      } else {
        await audioRef.current.play();
        setInternalPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setInternalPlaying(false);
    }
  };

  // Use internal playing state if no external isPlaying prop is provided
  const currentlyPlaying = isPlaying !== undefined ? isPlaying : internalPlaying;

  const handleGenerateArtwork = async () => {
    await generateSongArtwork(song);
  };

  const handleDownload = async () => {
    if (!song.audio_url) {
      toast({
        title: "No Audio Available",
        description: "This song doesn't have audio to download yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      await downloadSong(song.audio_url, song.title);
      toast({
        title: "Download Started",
        description: `Downloading "${song.title}"...`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the song. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card/95 to-card/90 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Ambient Lighting Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        
        <CardContent className="relative p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Album Artwork */}
            <motion.div 
              className="relative flex-shrink-0 mx-auto sm:mx-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                {song.artwork_url ? (
                  <img 
                    src={song.artwork_url} 
                    alt={`${song.title} artwork`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <Music className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60" />
                    {song.artwork_generating && (
                      <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </>
                )}
                
                {/* Play Button Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                >
                  <Button
                    size="sm"
                    onClick={handlePlayPause}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-black hover:text-black shadow-lg backdrop-blur-sm border-0 touch-manipulation"
                  >
                    {currentlyPlaying ? (
                      <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Song Information */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div className="min-w-0 flex-1 mb-4 sm:mb-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors duration-300">
                    {song.title}
                  </h3>
                  <p className="text-muted-foreground text-base sm:text-lg font-medium mb-3">
                    {song.stop_name}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                  >
                    {song.genre}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center sm:justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <SongSharingDropdown song={song} />
                  
                  {onRegenerate && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRegenerate(song)}
                      className="gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 touch-manipulation min-h-[44px]"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span className="hidden sm:inline">Regenerate</span>
                    </Button>
                  )}
                  
                  {song.audio_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      className="gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 touch-manipulation min-h-[44px]"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-border/50 hover:border-primary/50 hover:bg-primary/5 touch-manipulation min-h-[44px]"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-sm border-border/50 z-50">
                      <DropdownMenuItem 
                        onClick={handleGenerateArtwork}
                        disabled={artworkLoading || song.artwork_generating}
                        className="hover:bg-primary/10"
                      >
                        {artworkLoading || song.artwork_generating ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4 mr-2" />
                        )}
                        {song.artwork_url ? 'Regenerate Artwork' : 'Generate Artwork'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Story and People Section */}
          {(song.stories || song.people) && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {song.stories && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    Story
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm bg-muted/30 rounded-lg p-3 sm:p-4 border border-border/30">
                    {song.stories}
                  </p>
                </div>
              )}
              
              {song.people && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    People
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm bg-muted/30 rounded-lg p-3 sm:p-4 border border-border/30">
                    {song.people}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Audio Player */}
          {song.audio_url && (
            <div className="space-y-4">
              {/* Waveform Visualization Placeholder */}
              <div className="relative h-12 sm:h-16 bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20 rounded-lg overflow-hidden touch-manipulation">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/60 to-accent/60 transition-all duration-300 rounded-lg"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {Array.from({ length: window.innerWidth < 640 ? 20 : 40 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-0.5 sm:w-1 bg-primary/30 rounded-full transition-all duration-200 ${
                          i < (progressPercentage / 100) * (window.innerWidth < 640 ? 20 : 40) ? 'bg-primary' : ''
                        }`}
                        style={{ 
                          height: `${Math.random() * 20 + 8}px`,
                          animationDelay: `${i * 50}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 border-0 touch-manipulation"
                  >
                    {currentlyPlaying ? (
                      <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    ) : (
                      <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5 text-white" />
                    )}
                  </Button>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">
                      {formatTime(currentTime)} / {formatTime(duration || 180)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 touch-manipulation min-h-[44px]"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {song.audio_url && (
                <audio
                  ref={audioRef}
                  src={song.audio_url}
                  onLoadedData={() => setAudioLoaded(true)}
                  preload="metadata"
                />
              )}
            </div>
          )}

          {/* Lyrics Section */}
          {song.lyrics && (
            <div className="mt-6 sm:mt-8 space-y-3">
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Lyrics
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 sm:p-6 border border-border/30">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {song.lyrics}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};