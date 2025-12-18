
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export const VolumeControl = ({ volume, onVolumeChange, onToggleMute, isMuted }: VolumeControlProps) => {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleMute}
        className="min-h-[44px] min-w-[44px]"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
        ) : (
          <Volume2 className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
        )}
      </Button>
      <Slider
        value={[isMuted ? 0 : volume]}
        max={1}
        step={0.1}
        onValueChange={onVolumeChange}
        className="flex-1 cursor-pointer touch-manipulation"
      />
    </div>
  );
};
