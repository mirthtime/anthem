
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  Share2, 
  ArrowUpDown,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTrips } from '@/hooks/useTrips';
import { useSongManagement } from '@/hooks/useSongManagement';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAudio } from '@/contexts/AudioContext';
import { SongCard } from '@/components/SongCard';
import { TripStopForm } from '@/components/TripStopForm';
import { SongEditModal } from '@/components/SongEditModal';
import { SongReorderList } from '@/components/SongReorderList';
import { EmptyState } from '@/components/EmptyState';
import { MiniPlayer } from '@/components/audio/MiniPlayer';
import { AdvancedPlayerControls } from '@/components/audio/AdvancedPlayerControls';
import { QueueManager } from '@/components/audio/QueueManager';
import { NowPlayingCard } from '@/components/audio/NowPlayingCard';
import { PlaylistControls } from '@/components/audio/PlaylistControls';
import { toast } from '@/hooks/use-toast';

export default function TripAlbum() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, loading: tripsLoading } = useTrips();
  
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
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  const [showStopForm, setShowStopForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedView, setSelectedView] = useState<'songs' | 'queue' | 'nowplaying'>('songs');

  const trip = trips.find(t => t.id === tripId);

  useEffect(() => {
    if (!tripsLoading && !trip && tripId !== 'new') {
      navigate('/dashboard');
    }
  }, [trip, tripsLoading, navigate, tripId]);

  const handleGenerateSong = async (data: {
    stopName: string;
    people: string;
    stories: string;
    genre: string;
  }) => {
    if (!tripId || tripId === 'new') {
      toast({
        title: "Error",
        description: "Please save your trip first before adding songs.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // This would integrate with the song generation service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Song Generated!",
        description: `Created a ${data.genre} song for ${data.stopName}`,
      });
      
      setShowStopForm(false);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate song. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayAlbum = () => {
    if (songs.length === 0) return;
    setQueue(songs, 0);
  };

  const handlePlaySongAtIndex = (songIndex: number) => {
    setQueue(songs, songIndex);
  };

  if (tripsLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!trip && tripId !== 'new') {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Trip not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
                {trip?.title || 'New Trip Album'}
              </h1>
              {trip?.description && (
                <p className="text-muted-foreground mt-1">{trip.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">{songs.length} songs</Badge>
                {trip?.stops && (
                  <Badge variant="outline">{trip.stops.length} stops</Badge>
                )}
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowStopForm(true)} 
            size="lg"
            className="gap-2 bg-gradient-primary hover:bg-gradient-primary/90"
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
      </motion.div>

      {/* Enhanced Layout with Sidebar */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Playlist Controls */}
          {songs.length > 0 && (
            <PlaylistControls 
              songs={songs}
              title={trip?.title ? `${trip.title} Album` : 'Trip Album'}
            />
          )}

          {/* View Toggle */}
          {songs.length > 0 && (
            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedView === 'songs' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedView('songs')}
                  >
                    Songs
                  </Button>
                  <Button
                    variant={selectedView === 'queue' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedView('queue')}
                  >
                    Queue
                  </Button>
                  <Button
                    variant={selectedView === 'nowplaying' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedView('nowplaying')}
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Now Playing
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content based on selected view */}
          {selectedView === 'songs' && (
            <>
              {showStopForm ? (
                <TripStopForm 
                  onSubmit={handleGenerateSong} 
                  loading={isGenerating} 
                />
              ) : songs.length === 0 ? (
                <EmptyState 
                  title="No songs yet"
                  description="Add your first stop to generate a song"
                  actionLabel="Add Stop"
                  onAction={() => setShowStopForm(true)}
                />
              ) : (
                <div className="grid gap-6">
                  {songs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SongCard
                        song={song}
                        onEdit={() => handleEditSong(song)}
                        onDelete={() => handleDeleteSong(song)}
                        showTripInfo={false}
                        actions={
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={currentSong?.id === song.id && isPlaying ? "default" : "secondary"}
                              onClick={() => handlePlaySongAtIndex(index)}
                              className="gap-2"
                            >
                              <Play className="h-4 w-4" />
                              {currentSong?.id === song.id && isPlaying ? 'Playing' : 'Play'}
                            </Button>
                          </div>
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {selectedView === 'queue' && <QueueManager />}
          
          {selectedView === 'nowplaying' && (
            <div className="space-y-6">
              <NowPlayingCard />
              <AdvancedPlayerControls />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Queue Manager in Sidebar */}
          {selectedView === 'songs' && <QueueManager />}
          
          {/* Trip Info */}
          {trip && (
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trip.stops && trip.stops.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Planned Stops:</h4>
                    <div className="space-y-2">
                      {trip.stops.map((stop, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{stop.name}</div>
                          {stop.description && (
                            <div className="text-muted-foreground">{stop.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <div>Created: {new Date(trip.created_at).toLocaleDateString()}</div>
                  <div>Last updated: {new Date(trip.updated_at).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {editingSong && (
        <SongEditModal
          song={editingSong}
          onSave={handleSaveEdit}
          onClose={() => setEditingSong(null)}
        />
      )}

      {showReorderModal && (
        <SongReorderList
          songs={songs}
          onReorder={handleReorderSongs}
          onClose={() => setShowReorderModal(false)}
        />
      )}

      {/* Mini Player */}
      <MiniPlayer />
    </div>
  );
}
