
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
    <div className="flex items-center gap-3">
      <Button size="sm" variant="ghost" onClick={onToggleMute}>
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
        onValueChange={onVolumeChange}
        className="flex-1"
      />
    </div>
  );
};
