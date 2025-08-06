
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  ListMusic,
  Clock,
  Music
} from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { Song } from '@/types';

interface PlaylistControlsProps {
  songs: Song[];
  title?: string;
  className?: string;
}

export const PlaylistControls = ({ songs, title = "Playlist", className }: PlaylistControlsProps) => {
  const {
    queue,
    isPlaying,
    isShuffle,
    repeatMode,
    currentSong,
    setQueue,
    play,
    pause,
    next,
    previous,
    toggleShuffle,
    setRepeatMode
  } = useAudio();

  const [showStats, setShowStats] = useState(false);

  const handlePlayPlaylist = () => {
    if (songs.length === 0) return;
    setQueue(songs, 0);
    if (!isPlaying) {
      play();
    }
  };

  const cycleRepeatMode = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const totalDuration = songs.reduce((acc, song) => {
    // Estimate 3 minutes per song if no duration available
    return acc + 180; // 180 seconds = 3 minutes
  }, 0);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getRepeatModeText = () => {
    switch (repeatMode) {
      case 'one': return 'Repeat One';
      case 'all': return 'Repeat All';
      default: return 'No Repeat';
    }
  };

  return (
    <Card className={`bg-gradient-card border-border shadow-card ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListMusic className="h-5 w-5" />
            {title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Music className="h-4 w-4" />
              {songs.length} songs
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              ~{formatDuration(totalDuration)}
            </span>
          </div>
          {currentSong && queue.songs.length > 0 && (
            <Badge variant="secondary">
              Playing from {title}
            </Badge>
          )}
        </div>

        {showStats && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Genres</h4>
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(songs.map(s => s.genre))).map(genre => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Locations</h4>
                <div className="text-muted-foreground">
                  {Array.from(new Set(songs.map(s => s.stop_name))).length} unique stops
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleShuffle}
            className={isShuffle ? 'bg-primary/10 border-primary text-primary' : ''}
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={previous}>
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            onClick={queue.songs.length > 0 && currentSong ? (isPlaying ? pause : play) : handlePlayPlaylist}
            className="h-12 w-12 rounded-full"
          >
            {isPlaying && currentSong ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={next}>
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={cycleRepeatMode}
            className={repeatMode !== 'none' ? 'bg-primary/10 border-primary text-primary relative' : ''}
          >
            <Repeat className="h-4 w-4" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 text-xs">1</span>
            )}
          </Button>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            {isShuffle && 'Shuffle • '}
            {getRepeatModeText()}
            {queue.songs.length > 0 && currentSong && (
              <>
                {' • '}
                Playing: {currentSong.title}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
