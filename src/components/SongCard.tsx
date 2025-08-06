import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Song } from '@/types';
import { Play, Pause, Download, Share2, Music, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useSharing } from '@/hooks/useSharing';
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
  const { 
    generateShareableUrl, 
    copyToClipboard, 
    downloadAudio, 
    shareToTwitter, 
    generateSongCaption 
  } = useSharing();

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  const handleDownload = () => {
    if (song.audio_url) {
      downloadAudio(song.audio_url, `${song.title} - ${song.stop_name}`);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = generateShareableUrl('song', song.id);
    copyToClipboard(shareUrl, 'Song link copied!');
  };

  const handleCopyCaption = () => {
    const caption = generateSongCaption(song.title, song.stop_name, song.genre);
    copyToClipboard(caption, 'Caption copied!');
  };

  const handleShareToTwitter = () => {
    const shareUrl = generateShareableUrl('song', song.id);
    const description = generateSongCaption(song.title, song.stop_name, song.genre);
    shareToTwitter({
      title: song.title,
      description,
      url: shareUrl,
      audioUrl: song.audio_url || undefined,
      type: 'song'
    });
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
              <div className="p-2 rounded-full bg-gradient-primary">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{song.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {song.stop_name} • {song.genre} • {song.duration}s
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
                
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyCaption}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Caption
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareToTwitter}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Share to Twitter
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