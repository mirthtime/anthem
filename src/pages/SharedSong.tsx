import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, MapPin, Users, Calendar, Play, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSharing } from '@/hooks/useSharing';
import { supabase } from '@/integrations/supabase/client';
import { Song } from '@/types';
import { toast } from '@/hooks/use-toast';

const SharedSong = () => {
  const { songId } = useParams<{ songId: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { shareToTwitter, generateSongCaption, copyToClipboard, downloadAudio } = useSharing();

  useEffect(() => {
    if (songId) {
      loadSharedSong();
    }
  }, [songId]);

  const loadSharedSong = async () => {
    if (!songId) return;

    try {
      setLoading(true);
      
      const { data: songData, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', songId)
        .maybeSingle();

      if (error) throw error;
      if (!songData) throw new Error('Song not found');

      setSong(songData);
      
    } catch (error) {
      console.error('Error loading shared song:', error);
      toast({
        title: "Error",
        description: "Could not load this song. It may be private or deleted.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!song) return;
    
    const shareUrl = `${window.location.origin}/share/song/${song.id}`;
    const description = generateSongCaption(song.title, song.stop_name, song.genre);
    
    shareToTwitter({
      title: song.title,
      description,
      url: shareUrl,
      audioUrl: song.audio_url || undefined,
      type: 'song'
    });
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/song/${songId}`;
    copyToClipboard(shareUrl, 'Song link copied!');
  };

  const handleDownload = () => {
    if (song?.audio_url) {
      downloadAudio(song.audio_url, `${song.title} - ${song.stop_name}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Song Not Found</h2>
            <p className="text-muted-foreground">
              This song may be private or no longer available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Music className="h-4 w-4" />
              <span>Shared from TripTunes AI</span>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-foreground">{song.title}</h1>
              <p className="text-xl text-muted-foreground mt-2">{song.stop_name}</p>
            </div>

            {/* Song Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge variant="secondary" className="text-base px-3 py-1">
                {song.genre}
              </Badge>
              {song.people && (
                <Badge variant="outline" className="text-base px-3 py-1 gap-1">
                  <Users className="h-4 w-4" />
                  {song.people}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(song.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Waveform Placeholder */}
                <div className="bg-accent/20 rounded-xl p-8 text-center">
                  <div className="h-32 flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-16 w-16 rounded-full"
                      disabled={!song.audio_url}
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                {/* Audio Element */}
                {song.audio_url && (
                  <audio
                    controls
                    className="w-full"
                    src={song.audio_url}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Share on Twitter
                  </Button>
                  <Button onClick={handleCopyLink} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Song Details */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                {song.stories && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Story</h3>
                    <p className="text-muted-foreground italic">"{song.stories}"</p>
                  </div>
                )}

                {song.lyrics && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Lyrics</h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted/20 p-4 rounded-lg">
                      {song.lyrics}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Duration:</span>{' '}
                    <span className="text-muted-foreground">{song.duration}s</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Location:</span>{' '}
                    <span className="text-muted-foreground">{song.stop_name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center border-t border-border pt-8">
            <p className="text-muted-foreground">
              Created with{' '}
              <a 
                href="https://triptunes.ai" 
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                TripTunes AI
              </a>
              {' '}• Generate your own road trip soundtrack
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SharedSong;