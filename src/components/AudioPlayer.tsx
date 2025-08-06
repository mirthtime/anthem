import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Repeat, 
  Shuffle,
  Download,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Song } from '@/types';
import { useSharing } from '@/hooks/useSharing';

interface AudioPlayerProps {
  songs: Song[];
  currentSongIndex: number;
  onSongChange: (index: number) => void;
  className?: string;
}

export const AudioPlayer = ({ songs, currentSongIndex, onSongChange, className }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const { downloadAudio } = useSharing();

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [currentSongIndex]);

  const handleSongEnd = () => {
    if (repeatMode === 'one') {
      playCurrentSong();
    } else if (repeatMode === 'all' || currentSongIndex < songs.length - 1) {
      nextSong();
    } else {
      setIsPlaying(false);
    }
  };

  const playCurrentSong = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const nextSong = () => {
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }
    onSongChange(nextIndex);
  };

  const previousSong = () => {
    if (currentTime > 3) {
      // If more than 3 seconds played, restart current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      // Go to previous song
      const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      onSongChange(prevIndex);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleDownload = () => {
    if (currentSong?.audio_url) {
      downloadAudio(currentSong.audio_url, `${currentSong.title} - ${currentSong.stop_name}`);
    }
  };

  if (!currentSong) return null;

  return (
    <Card className={`bg-gradient-card border-border shadow-card ${className}`}>
      <CardContent className="p-6">
        <audio
          ref={audioRef}
          src={currentSong.audio_url || undefined}
          preload="metadata"
        />
        
        {/* Now Playing Info */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {currentSong.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {currentSong.stop_name}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{currentSong.genre}</Badge>
                {currentSong.people && (
                  <Badge variant="outline">{currentSong.people}</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsShuffle(!isShuffle)}
              className={isShuffle ? 'text-primary' : 'text-muted-foreground'}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button size="sm" variant="ghost" onClick={previousSong}>
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              onClick={togglePlay}
              className="h-12 w-12 rounded-full"
              disabled={!currentSong.audio_url}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button size="sm" variant="ghost" onClick={nextSong}>
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={toggleRepeat}
              className={repeatMode !== 'none' ? 'text-primary' : 'text-muted-foreground'}
            >
              <Repeat className="h-4 w-4" />
              {repeatMode === 'one' && (
                <span className="text-xs ml-1">1</span>
              )}
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};