import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Disc3, Calendar, Users, Play, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useSharing } from '@/hooks/useSharing';
import { supabase } from '@/integrations/supabase/client';
import { Song, Trip, TripStop } from '@/types';
import { toast } from '@/hooks/use-toast';

const SharedTripAlbum = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const { shareToTwitter, generateTripCaption, copyToClipboard } = useSharing();

  useEffect(() => {
    if (tripId) {
      loadSharedTrip();
    }
  }, [tripId]);

  const loadSharedTrip = async () => {
    if (!tripId) return;

    try {
      setLoading(true);
      
      // Fetch trip data
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .maybeSingle();

      if (tripError) throw tripError;
      if (!tripData) throw new Error('Trip not found');

      // Parse stops if they're stored as JSON and ensure type compatibility
      const parsedTrip: Trip = {
        ...tripData,
        stops: Array.isArray(tripData.stops) 
          ? (tripData.stops as unknown as TripStop[])
          : []
      };
      setTrip(parsedTrip);

      // Fetch songs for this trip
      const { data: songsData, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });

      if (songsError) throw songsError;
      setSongs(songsData || []);
      
    } catch (error) {
      console.error('Error loading shared trip:', error);
      toast({
        title: "Error",
        description: "Could not load this trip. It may be private or deleted.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAlbum = () => {
    if (songs.length > 0) {
      setCurrentSongIndex(0);
      setShowPlayer(true);
    }
  };

  const handlePlaySong = (index: number) => {
    setCurrentSongIndex(index);
    setShowPlayer(true);
  };

  const handleShare = () => {
    if (!trip) return;
    
    const shareUrl = `${window.location.origin}/share/trip/${trip.id}`;
    const description = generateTripCaption(trip.title, trip.stops?.length || 0, songs.length);
    
    shareToTwitter({
      title: trip.title,
      description,
      url: shareUrl,
      type: 'trip'
    });
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/trip/${tripId}`;
    copyToClipboard(shareUrl, 'Trip link copied!');
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-16 w-96" />
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Trip Not Found</h2>
            <p className="text-muted-foreground">
              This trip may be private or no longer available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
           {/* Trip Info */}
           <div className="text-center space-y-4">
             <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
               <Disc3 className="h-4 w-4 text-primary" />
               <span className="tracking-wider">Shared from ANTHEM</span>
             </div>
             
             <div className="flex flex-col items-center space-y-4">
               {trip.artwork_url && (
                 <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg">
                   <img 
                     src={trip.artwork_url} 
                     alt={`${trip.title} album artwork`}
                     className="w-full h-full object-cover"
                   />
                 </div>
               )}
               <div>
                 <h1 className="text-4xl font-bold text-foreground">{trip.title}</h1>
                 {trip.description && (
                   <p className="text-muted-foreground mt-2 text-lg">{trip.description}</p>
               )}
             </div>
            </div>

            {/* Trip Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(trip.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{trip.stops?.length || 0} stops</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span>{songs.length} songs</span>
              </div>
            </div>

            {/* Action Buttons */}
            {songs.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={handlePlayAlbum} size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Play Album
                </Button>
                <Button onClick={handleShare} variant="outline" size="lg" className="gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Share
                </Button>
                <Button onClick={handleCopyLink} variant="outline" size="lg" className="gap-2">
                  <Download className="h-5 w-5" />
                  Copy Link
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Audio Player */}
        {showPlayer && songs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <AudioPlayer
              songs={songs}
              currentSongIndex={currentSongIndex}
              onSongChange={setCurrentSongIndex}
            />
          </motion.div>
        )}

        {/* Track List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          {songs.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground text-center">Track List</h2>
              
              <div className="space-y-3">
                {songs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`bg-gradient-card border-border shadow-card hover:shadow-button transition-all cursor-pointer ${
                        currentSongIndex === index && showPlayer ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handlePlaySong(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {song.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{song.stop_name}</span>
                                {song.people && (
                                  <>
                                    <span>•</span>
                                    <Users className="h-3 w-3" />
                                    <span>{song.people}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{song.genre}</Badge>
                            <Button size="sm" variant="ghost">
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {song.stories && (
                          <p className="text-sm text-muted-foreground italic mt-3 pl-12">
                            "{song.stories}"
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Songs Yet</h3>
              <p className="text-muted-foreground">
                This trip doesn't have any songs yet. Check back later!
              </p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center border-t border-border pt-8"
        >
          <p className="text-muted-foreground">
            Created with{' '}
            <a
              href="/"
              className="text-primary hover:underline font-medium tracking-wider"
              target="_blank"
              rel="noopener noreferrer"
            >
              ANTHEM
            </a>
            {' '}• Turn your memories into music
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SharedTripAlbum;