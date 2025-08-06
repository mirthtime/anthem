
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Song } from '@/types';
import { Play, Pause, Music, ImageIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useArtwork } from '@/hooks/useArtwork';
import { SongSharingDropdown } from '@/components/sharing/SongSharingDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SongCardProps {
  song: Song;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
}

export const SongCard = ({ 
  song, 
  onPlay, 
  onPause, 
  isPlaying = false 
}: SongCardProps) => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const { generateSongArtwork, loading: artworkLoading } = useArtwork();

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  const handleGenerateArtwork = async () => {
    await generateSongArtwork(song);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                {song.artwork_url ? (
                  <img 
                    src={song.artwork_url} 
                    alt={`${song.title} artwork`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                )}
                {song.artwork_generating && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{song.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {song.stop_name} • {song.genre}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {song.stories && (
            <div>
              <p className="text-sm font-medium mb-1">Story</p>
              <p className="text-sm text-muted-foreground">{song.stories}</p>
            </div>
          )}

          {song.people && (
            <div>
              <p className="text-sm font-medium mb-1">People</p>
              <p className="text-sm text-muted-foreground">{song.people}</p>
            </div>
          )}

          {song.audio_url && (
            <div className="space-y-3">
              <audio
                src={song.audio_url}
                onLoadedData={() => setAudioLoaded(true)}
                className="w-full"
                controls
              />
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePlayPause}
                  disabled={!audioLoaded}
                  className="flex-1"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
                
                <SongSharingDropdown song={song} />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={handleGenerateArtwork}
                      disabled={artworkLoading || song.artwork_generating}
                    >
                      {artworkLoading || song.artwork_generating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4 mr-2" />
                      )}
                      {song.artwork_url ? 'Regenerate Artwork' : 'Generate Artwork'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {song.lyrics && (
            <div>
              <p className="text-sm font-medium mb-2">Lyrics</p>
              <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted/20 p-3 rounded-lg">
                {song.lyrics}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
