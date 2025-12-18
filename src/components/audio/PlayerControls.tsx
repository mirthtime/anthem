
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
    <div className="flex items-center justify-center gap-3 md:gap-4">
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleShuffle}
        className={`min-h-[44px] min-w-[44px] ${isShuffle ? 'text-primary' : 'text-muted-foreground'}`}
        disabled={disabled}
      >
        <Shuffle className="h-5 w-5 md:h-4 md:w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={onPrevious}
        disabled={disabled}
        className="min-h-[44px] min-w-[44px]"
      >
        <SkipBack className="h-5 w-5 md:h-4 md:w-4" />
      </Button>

      <Button
        size="lg"
        onClick={onTogglePlay}
        className="h-14 w-14 md:h-12 md:w-12 rounded-full"
        disabled={disabled}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 md:h-5 md:w-5" />
        ) : (
          <Play className="h-6 w-6 md:h-5 md:w-5" />
        )}
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={onNext}
        disabled={disabled}
        className="min-h-[44px] min-w-[44px]"
      >
        <SkipForward className="h-5 w-5 md:h-4 md:w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleRepeat}
        className={`min-h-[44px] min-w-[44px] ${repeatMode !== 'none' ? 'text-primary' : 'text-muted-foreground'}`}
        disabled={disabled}
      >
        <Repeat className="h-5 w-5 md:h-4 md:w-4" />
        {repeatMode === 'one' && (
          <span className="text-xs ml-1">1</span>
        )}
      </Button>
    </div>
  );
};
