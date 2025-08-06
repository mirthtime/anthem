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
  Trash2,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTrips } from '@/hooks/useTrips';
import { useSongManagement } from '@/hooks/useSongManagement';
import { StopStoryForm } from '@/components/StopStoryForm';
import { EmptyState } from '@/components/EmptyState';
import { SongEditModal } from '@/components/SongEditModal';
import { SongReorderList } from '@/components/SongReorderList';
import { toast } from '@/hooks/use-toast';
import { Song } from '@/types';
import { useAudio } from '@/contexts/AudioContext';
import { QueueManager } from '@/components/audio/QueueManager';
import { AdvancedPlayerControls } from '@/components/audio/AdvancedPlayerControls';

export const TripAlbum = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { getTripById } = useTrips();
  const {
    songs,
    editingSong,
    showReorderModal,
    setEditingSong,
    setShowReorderModal,
    handleEditSong,
    handleSaveEdit,
    handleDeleteSong,
    handleReorderSongs
  } = useSongManagement(tripId);
  
  const { setQueue, currentSong, isPlaying } = useAudio();
  
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
    loadTrip();
  };

  const handlePlaySong = (songId: string) => {
    if (currentlyPlaying === songId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(songId);
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

  const handlePlayAlbum = () => {
    if (songs.length > 0) {
      setQueue(songs, 0);
    }
  };

  const handlePlaySong = (songIndex: number) => {
    setQueue(songs, songIndex);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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

        {/* Enhanced Action Buttons */}
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
            <Button 
              variant="secondary" 
              size="lg" 
              className="gap-2"
              onClick={handlePlayAlbum}
            >
              <Play className="h-5 w-5" />
              Play Album
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Share2 className="h-5 w-5" />
              Share Album
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2"
              onClick={() => setShowReorderModal(true)}
            >
              <ArrowUpDown className="h-5 w-5" />
              Reorder Songs
            </Button>
          </>
        )}
      </div>

      {/* Enhanced Layout with Sidebar */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
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
                      <Card className={`bg-gradient-card border-border shadow-card hover:shadow-button transition-all cursor-pointer ${
                        currentSong?.id === song.id ? 'ring-2 ring-primary' : ''
                      }`}>
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
                                    <DropdownMenuItem onClick={() => handleEditSong(song)}>
                                      <Edit2 className="h-4 w-4 mr-2" />
                                      Edit Song
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
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

                              {/* Enhanced Audio Player */}
                              <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl border border-border">
                                <Button
                                  size="sm"
                                  variant={currentSong?.id === song.id && isPlaying ? "default" : "secondary"}
                                  onClick={() => handlePlaySong(index)}
                                  className="gap-2"
                                >
                                  <Play className="h-4 w-4" />
                                  {currentSong?.id === song.id && isPlaying ? 'Playing...' : 'Play'}
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

        {/* Sidebar with Audio Controls and Queue */}
        <div className="lg:col-span-1 space-y-6">
          {/* Advanced Player Controls */}
          {currentSong && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AdvancedPlayerControls />
            </motion.div>
          )}

          {/* Queue Manager */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <QueueManager />
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <SongEditModal
        song={editingSong}
        isOpen={!!editingSong}
        onClose={() => setEditingSong(null)}
        onSave={handleSaveEdit}
      />

      <SongReorderList
        songs={songs}
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        onReorder={handleReorderSongs}
      />
    </div>
  );
};
