
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Settings,
  Headphones,
  Zap
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAudio } from '@/contexts/AudioContext';

interface AdvancedPlayerControlsProps {
  className?: string;
}

export const AdvancedPlayerControls = ({ className }: AdvancedPlayerControlsProps) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    crossfadeDuration,
    currentSong,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    setCrossfadeDuration
  } = useAudio();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <span className="absolute -top-1 -right-1 text-xs">1</span>;
      case 'all':
        return null;
      default:
        return null;
    }
  };

  const cycleRepeatMode = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  if (!currentSong) return null;

  return (
    <Card className={`bg-gradient-card border-border shadow-card ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
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

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleShuffle}
              className={isShuffle ? 'text-primary' : 'text-muted-foreground'}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button size="sm" variant="ghost" onClick={previous}>
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              onClick={isPlaying ? pause : play}
              className="h-12 w-12 rounded-full"
              disabled={!currentSong.audio_url}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button size="sm" variant="ghost" onClick={next}>
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={cycleRepeatMode}
              className={repeatMode !== 'none' ? 'text-primary relative' : 'text-muted-foreground relative'}
            >
              <Repeat className="h-4 w-4" />
              {getRepeatIcon()}
            </Button>
          </div>

          {/* Volume and Advanced Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Button size="sm" variant="ghost" onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={(value) => setVolume(value[0])}
                className="flex-1 max-w-[120px]"
              />
              <span className="text-xs text-muted-foreground min-w-[3ch]">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
              <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Audio Settings</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Crossfade Duration
                          </label>
                          <Badge variant="outline" className="text-xs">
                            {crossfadeDuration}s
                          </Badge>
                        </div>
                        <Slider
                          value={[crossfadeDuration]}
                          max={10}
                          step={0.5}
                          onValueChange={(value) => setCrossfadeDuration(value[0])}
                          className="w-full"
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Headphones className="h-4 w-4" />
                          Playback Quality
                        </label>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Auto
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            High
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Ultra
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Queue Settings</h4>
                    <div className="text-xs text-muted-foreground">
                      <p>• Shuffle: {isShuffle ? 'On' : 'Off'}</p>
                      <p>• Repeat: {repeatMode === 'none' ? 'Off' : repeatMode === 'one' ? 'Track' : 'All'}</p>
                      <p>• Crossfade: {crossfadeDuration}s transitions</p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
