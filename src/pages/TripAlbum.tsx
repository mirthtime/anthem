import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Music, 
  Plus, 
  Play, 
  Download, 
  Share2, 
  Clock,
  Users,
  Calendar,
  ArrowLeft,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTrips } from '@/hooks/useTrips';
import { useSongs } from '@/hooks/useSongs';
import { StopStoryForm } from '@/components/StopStoryForm';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/hooks/use-toast';
import { Song } from '@/types';

export const TripAlbum = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { getTripById } = useTrips();
  const { songs, loading: songsLoading, deleteSong } = useSongs(tripId);
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddStop, setShowAddStop] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const loadTrip = async () => {
    if (!tripId) return;
    
    setLoading(true);
    try {
      const tripData = await getTripById(tripId);
      setTrip(tripData);
    } catch (error) {
      console.error('Error loading trip:', error);
      toast({
        title: "Error",
        description: "Failed to load trip details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStopComplete = () => {
    setShowAddStop(false);
    loadTrip(); // Refresh trip data
  };

  const handlePlaySong = (songId: string) => {
    if (currentlyPlaying === songId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(songId);
      // TODO: Implement actual audio playback
    }
  };

  const handleDeleteSong = async (song: Song) => {
    if (!confirm(`Are you sure you want to delete "${song.title}"?`)) return;
    
    try {
      await deleteSong(song.id);
      toast({
        title: "Song Deleted",
        description: "The song has been removed from your album.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete song. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (showAddStop) {
    return (
      <StopStoryForm 
        existingTripId={tripId}
        onComplete={handleAddStopComplete}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-96" />
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon={MapPin}
          title="Trip Not Found"
          description="The trip you're looking for doesn't exist or has been deleted."
          actionLabel="Back to Dashboard"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Back Button & Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trips
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{trip.title}</h1>
            {trip.description && (
              <p className="text-muted-foreground mt-2">{trip.description}</p>
            )}
          </div>

          {/* Trip Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Started {formatDate(trip.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{trip.stops.length} stops</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>{songs.length} songs</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setShowAddStop(true)}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Next Stop
          </Button>
          
          {songs.length > 0 && (
            <>
              <Button variant="secondary" size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Play Album
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="h-5 w-5" />
                Share Album
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Songs Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-12"
      >
        {songs.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Your Musical Journey</h2>
            
            <div className="space-y-4">
              {songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-card border-border shadow-card hover:shadow-button transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Song Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {song.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{song.stop_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(song.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Edit Song
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteSong(song)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Song Details */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">{song.genre}</Badge>
                              <Badge variant="outline">{song.duration}s</Badge>
                              {song.people && (
                                <Badge variant="outline" className="gap-1">
                                  <Users className="h-3 w-3" />
                                  {song.people}
                                </Badge>
                              )}
                            </div>
                            
                            {song.stories && (
                              <p className="text-sm text-muted-foreground italic">
                                "{song.stories}"
                              </p>
                            )}
                          </div>

                          {/* Audio Player Placeholder */}
                          <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl border border-border">
                            <Button
                              size="sm"
                              variant={currentlyPlaying === song.id ? "default" : "secondary"}
                              onClick={() => handlePlaySong(song.id)}
                              className="gap-2"
                            >
                              <Play className="h-4 w-4" />
                              {currentlyPlaying === song.id ? 'Playing...' : 'Play'}
                            </Button>
                            
                            <div className="flex-1 text-sm text-muted-foreground">
                              {song.audio_url ? 'Ready to play' : 'Generating audio...'}
                            </div>
                            
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Music}
            title="No songs yet"
            description="Start creating your musical journey by capturing your first stop's story and memories."
            actionLabel="Add Your First Stop"
            onAction={() => setShowAddStop(true)}
          />
        )}
      </motion.div>
    </div>
  );
};