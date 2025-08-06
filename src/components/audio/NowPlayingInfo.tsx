
import { Music, Download, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Song } from '@/types';

interface NowPlayingInfoProps {
  song: Song;
  onDownload: () => void;
  onToggleFavorite: () => void;
  isFavorited?: boolean;
}

export const NowPlayingInfo = ({ 
  song, 
  onDownload, 
  onToggleFavorite, 
  isFavorited = false 
}: NowPlayingInfoProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {song.artwork_url ? (
            <img 
              src={song.artwork_url} 
              alt={`${song.title} artwork`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {song.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {song.stop_name}
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{song.genre}</Badge>
            {song.people && (
              <Badge variant="outline">{song.people}</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onToggleFavorite}
          className={isFavorited ? 'text-red-500' : ''}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
