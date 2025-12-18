
import { Slider } from '@/components/ui/slider';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
}

export const ProgressBar = ({ currentTime, duration, onSeek }: ProgressBarProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={1}
        onValueChange={onSeek}
        className="w-full cursor-pointer touch-manipulation"
      />
      <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
