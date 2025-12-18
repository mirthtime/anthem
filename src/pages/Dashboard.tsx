
import { motion } from 'framer-motion';
import { Plus, MapPin, Heart, Music, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TripCard } from '@/components/TripCard';
import { SongCard } from '@/components/SongCard';
import { EmptyState } from '@/components/EmptyState';
import { useTrips } from '@/hooks/useTrips';
import { useSongs } from '@/hooks/useSongs';
import { useCredits } from '@/hooks/useCredits';
import { Skeleton } from '@/components/ui/skeleton';
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { trips, loading } = useTrips();
  const { balance } = useCredits();
  const { songs: standaloneSongs, loading: songsLoading } = useSongs(); // Get all user's standalone songs

  // Initialize scroll animations
  useScrollAnimations();

  const handleCreateTrip = () => {
    navigate('/trip/new');
  };

  // Filter songs that don't belong to any trip (standalone songs)
  const unassignedSongs = standaloneSongs.filter(song => !song.trip_id);

  // Count completed songs for stats
  const completedSongsCount = standaloneSongs.filter(song => song.status === 'completed' || (!song.status && song.audio_url)).length;

  if (loading || songsLoading) {
    return (
      <div className="min-h-screen bg-background relative">
        <AnimatedBackground />
        <FloatingMusicNotes />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {/* Header Skeleton */}
          <div className="mb-12 text-center">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <FloatingMusicNotes />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 scroll-fade-in"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-4 md:mb-6">
            <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">Your Musical Journey</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 px-2">
            Your <span className="text-transparent bg-clip-text bg-gradient-sunset heartbeat">Musical</span> Adventures
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Every adventure tells a story. Create, manage, and enjoy AI-generated soundtracks that capture the exact feeling of your most <span className="text-primary font-medium">precious moments</span>
          </p>
        </motion.div>

        {/* Quick Stats */}
        {trips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 scroll-scale-in"
          >
            <div className="premium-card interactive-card p-4 md:p-6 text-center">
              <div className="flex justify-center mb-3 md:mb-4">
                <div className="p-2.5 md:p-3 rounded-full bg-primary/20 border border-primary/30">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2 heartbeat">{trips.length}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Musical Adventures</div>
            </div>

            <div className="premium-card interactive-card p-4 md:p-6 text-center">
              <div className="flex justify-center mb-3 md:mb-4">
                <div className="p-2.5 md:p-3 rounded-full bg-primary/20 border border-primary/30">
                  <Music className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2 heartbeat">
                {trips.reduce((total, trip) => total + trip.stops.length, 0)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Captured Moments</div>
            </div>

            <div className="premium-card interactive-card p-4 md:p-6 text-center">
              <div className="flex justify-center mb-3 md:mb-4">
                <div className="p-2.5 md:p-3 rounded-full bg-primary/20 border border-primary/30">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2 heartbeat">
                {completedSongsCount}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Songs Created</div>
            </div>
          </motion.div>
        )}

        {/* Action Button for existing trips */}
        {trips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center mb-8 md:mb-12 px-4"
          >
            <Button
              onClick={handleCreateTrip}
              size="lg"
              className="shine-button text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-glow gap-2 md:gap-3 w-full sm:w-auto"
            >
              <Plus className="h-5 w-5 md:h-6 md:w-6" />
              Capture Another Memory
            </Button>
          </motion.div>
        )}

        {/* Show Trips and Standalone Songs */}
        {trips.length > 0 || unassignedSongs.length > 0 ? (
          <div className="space-y-8 md:space-y-12">
            {/* Trips Section */}
            {trips.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Your Trip Albums</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {trips.map((trip, index) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                      className="scroll-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TripCard trip={trip} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Standalone Songs Section */}
            {unassignedSongs.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Your Memories</h2>
                <div className="grid gap-4 md:gap-6">
                  {unassignedSongs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                      className="scroll-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <SongCard song={song} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <EmptyState
              icon={MapPin}
              title="Your first musical adventure awaits"
              description="Every memory deserves a soundtrack. Start capturing your adventures - each moment becomes a unique song that tells your story and takes you back to exactly how you felt."
              actionLabel="Capture Your First Memory"
              onAction={handleCreateTrip}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};
