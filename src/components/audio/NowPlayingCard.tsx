
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  MapPin, 
  Users, 
  Heart, 
  Download, 
  Share2,
  MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAudio } from '@/contexts/AudioContext';
import { useSharing } from '@/hooks/useSharing';

interface NowPlayingCardProps {
  className?: string;
}

export const NowPlayingCard = ({ className }: NowPlayingCardProps) => {
  const { currentSong, favorites, toggleFavorite } = useAudio();
  const { downloadAudio, shareToTwitter, generateSongCaption, generateShareableUrl } = useSharing();

  if (!currentSong) return null;

  const handleDownload = () => {
    if (currentSong.audio_url) {
      downloadAudio(currentSong.audio_url, currentSong.title);
    }
  };

  const handleShare = () => {
    const shareUrl = generateShareableUrl('song', currentSong.id);
    const caption = generateSongCaption(currentSong.title, currentSong.stop_name, currentSong.genre);
    shareToTwitter({
      title: currentSong.title,
      description: caption,
      url: shareUrl,
      audioUrl: currentSong.audio_url,
      type: 'song'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Album Art */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              {currentSong.artwork_url ? (
                <img 
                  src={currentSong.artwork_url} 
                  alt={`${currentSong.title} artwork`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                  <Music className="h-8 w-8 text-white" />
                </div>
              )}
              {currentSong.artwork_generating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground truncate mb-1">
                {currentSong.title}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{currentSong.stop_name}</span>
                {currentSong.people && (
                  <>
                    <span>•</span>
                    <Users className="h-4 w-4" />
                    <span className="truncate">{currentSong.people}</span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary">{currentSong.genre}</Badge>
                  {favorites.has(currentSong.id) && (
                    <Badge variant="outline" className="text-red-500 border-red-500">
                      Favorite
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(currentSong.id)}
                    className={favorites.has(currentSong.id) ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(currentSong.id) ? 'fill-current' : ''}`} />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleDownload} disabled={!currentSong.audio_url}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Audio
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Song
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Story Preview */}
              {currentSong.stories && (
                <div className="mt-3 p-3 bg-accent/30 rounded-lg">
                  <p className="text-sm text-muted-foreground italic line-clamp-2">
                    "{currentSong.stories}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
