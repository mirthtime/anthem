
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  Share2, 
  ArrowUpDown,
  Headphones,
  Music2,
  Heart,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTrips } from '@/hooks/useTrips';
import { useSongManagement } from '@/hooks/useSongManagement';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAuth } from '@/hooks/useAuth';
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
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import { toast } from '@/hooks/use-toast';
import { Song } from '@/types';

export default function TripAlbum() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  
  // Enable keyboard shortcuts and scroll animations
  useKeyboardShortcuts();
  useScrollAnimations();

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
      // Import the useSongs hook functionality
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Create song record with placeholder audio
      const { data: song, error } = await supabase
        .from('songs')
        .insert([{
          title: `${data.stopName} Memory`,
          stop_name: data.stopName,
          people: data.people,
          stories: data.stories,
          genre: data.genre,
          prompt: `A ${data.genre} song about ${data.stories} at ${data.stopName}${data.people ? ` with ${data.people}` : ''}`,
          audio_url: 'https://gicplztxvichoksdivlu.supabase.co/storage/v1/object/public/audio-files/Corpus%20Christi.wav',
          trip_id: tripId,
          user_id: user?.id || null
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Song Generated!",
        description: `Created a ${data.genre} song for ${data.stopName}. You can regenerate if you want a different style!`,
      });
      
      // Refresh the songs list
      window.location.reload(); // Simple refresh for now
      setShowStopForm(false);
    } catch (error) {
      console.error('Error generating song:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate song. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSong = async (songToRegenerate: Song) => {
    setIsGenerating(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Create a new song with the same parameters but regenerated audio
      const { data: newSong, error } = await supabase
        .from('songs')
        .insert([{
          title: `${songToRegenerate.stop_name} Memory (v2)`,
          stop_name: songToRegenerate.stop_name,
          people: songToRegenerate.people,
          stories: songToRegenerate.stories,
          genre: songToRegenerate.genre,
          prompt: songToRegenerate.prompt,
          audio_url: 'https://gicplztxvichoksdivlu.supabase.co/storage/v1/object/public/audio-files/Corpus%20Christi.wav',
          trip_id: tripId,
          user_id: user?.id || null
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Song Regenerated!",
        description: `Created a new version of ${songToRegenerate.stop_name}. Both versions are available.`,
      });
      
      // Refresh the songs list
      window.location.reload();
    } catch (error) {
      console.error('Error regenerating song:', error);
      toast({
        title: "Regeneration Failed",
        description: "Unable to regenerate song. Please try again.",
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
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <FloatingMusicNotes />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!trip && tripId !== 'new') {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <FloatingMusicNotes />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground mb-4">Trip not found</h1>
          <p className="text-muted-foreground mb-6">This musical adventure doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/dashboard')} className="shine-button">
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingMusicNotes />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-32 left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="scroll-fade-in"
        >
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="gap-2 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Adventures
            </Button>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-6">
              <Music2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Musical Album</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              {trip?.title ? (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-sunset heartbeat">{trip.title}</span> Album
                </>
              ) : (
                'New <span className="text-transparent bg-clip-text bg-gradient-sunset heartbeat">Musical</span> Adventure'
              )}
            </h1>
            
            {trip?.description && (
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">{trip.description}</p>
            )}
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Heart className="h-3 w-3 mr-1" />
                {songs.length} songs
              </Badge>
              {trip?.stops && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {trip.stops.length} memories
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => setShowStopForm(true)} 
                size="lg"
                className="shine-button text-lg px-8 py-6 shadow-glow gap-3"
              >
                <Plus className="h-6 w-6" />
                Capture Next Memory
              </Button>
            
              {songs.length > 0 && (
                <>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="gap-3 text-lg px-8 py-6 interactive-card"
                    onClick={handlePlayAlbum}
                  >
                    <Play className="h-6 w-6" />
                    Play Album
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-3 text-lg px-8 py-6 border-border/50 hover:border-primary/50"
                    onClick={() => setShowReorderModal(true)}
                  >
                    <ArrowUpDown className="h-6 w-6" />
                    Reorder
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Layout with Sidebar */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Playlist Controls */}
            {songs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="scroll-scale-in"
              >
                <PlaylistControls 
                  songs={songs}
                  title={trip?.title ? `${trip.title} Album` : 'Trip Album'}
                />
              </motion.div>
            )}

            {/* View Toggle */}
            {songs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card className="premium-card border-border/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Button
                        variant={selectedView === 'songs' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedView('songs')}
                        className="gap-2"
                      >
                        <Music2 className="h-4 w-4" />
                        Songs
                      </Button>
                      <Button
                        variant={selectedView === 'queue' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedView('queue')}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Queue
                      </Button>
                      <Button
                        variant={selectedView === 'nowplaying' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedView('nowplaying')}
                        className="gap-2"
                      >
                        <Headphones className="h-4 w-4" />
                        Now Playing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Content based on selected view */}
            {selectedView === 'songs' && (
              <>
                {showStopForm ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <TripStopForm 
                      onSubmit={handleGenerateSong} 
                      loading={isGenerating} 
                    />
                  </motion.div>
                ) : songs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <EmptyState 
                      icon={Music2}
                      title="Your musical story awaits"
                      description="Add your first memory to create a song that captures exactly how this moment felt. Each song becomes a time machine back to your most precious experiences."
                      actionLabel="Capture First Memory"
                      onAction={() => setShowStopForm(true)}
                    />
                  </motion.div>
                ) : (
                  <div className="grid gap-8">
                    {songs.map((song, index) => (
                      <motion.div
                        key={song.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="scroll-scale-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <SongCard
                          song={song}
                          onPlay={() => handlePlaySongAtIndex(index)}
                          onRegenerate={handleRegenerateSong}
                          isPlaying={currentSong?.id === song.id && isPlaying}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {selectedView === 'queue' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <QueueManager />
              </motion.div>
            )}
            
            {selectedView === 'nowplaying' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <NowPlayingCard />
                <AdvancedPlayerControls />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Queue Manager in Sidebar */}
            {selectedView === 'songs' && (
              <div className="scroll-scale-in">
                <QueueManager />
              </div>
            )}
            
            {/* Trip Info */}
            {trip && (
              <Card className="premium-card border-border/30 shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {trip.stops && trip.stops.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-primary">Planned Memories:</h4>
                      <div className="space-y-3">
                        {trip.stops.map((stop, index) => (
                          <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                            <div className="font-medium text-foreground">{stop.name}</div>
                            {stop.description && (
                              <div className="text-sm text-muted-foreground mt-1">{stop.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Separator className="bg-border/50" />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Created: {new Date(trip.created_at).toLocaleDateString()}</div>
                    <div>Last updated: {new Date(trip.updated_at).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Modals */}
        {editingSong && (
          <SongEditModal
            song={editingSong}
            isOpen={!!editingSong}
            onSave={handleSaveEdit}
            onClose={() => setEditingSong(null)}
          />
        )}

        {showReorderModal && (
          <SongReorderList
            songs={songs}
            isOpen={showReorderModal}
            onReorder={handleReorderSongs}
            onClose={() => setShowReorderModal(false)}
          />
        )}

        {/* Mini Player */}
        <MiniPlayer />
      </div>
    </div>
  );
}
