
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  disabled?: boolean;
}

export const PlayerControls = ({
  isPlaying,
  isShuffle,
  repeatMode,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
  disabled = false
}: PlayerControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleShuffle}
        className={isShuffle ? 'text-primary' : 'text-muted-foreground'}
        disabled={disabled}
      >
        <Shuffle className="h-4 w-4" />
      </Button>

      <Button size="sm" variant="ghost" onClick={onPrevious} disabled={disabled}>
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button
        size="lg"
        onClick={onTogglePlay}
        className="h-12 w-12 rounded-full"
        disabled={disabled}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      <Button size="sm" variant="ghost" onClick={onNext} disabled={disabled}>
        <SkipForward className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleRepeat}
        className={repeatMode !== 'none' ? 'text-primary' : 'text-muted-foreground'}
        disabled={disabled}
      >
        <Repeat className="h-4 w-4" />
        {repeatMode === 'one' && (
          <span className="text-xs ml-1">1</span>
        )}
      </Button>
    </div>
  );
};
