import { motion } from 'framer-motion';
import { Plus, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TripCard } from '@/components/TripCard';
import { EmptyState } from '@/components/EmptyState';
import { useTrips } from '@/hooks/useTrips';
import { useCredits } from '@/hooks/useCredits';
import { Skeleton } from '@/components/ui/skeleton';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { trips, loading } = useTrips();
  const { balance } = useCredits();

  const handleCreateTrip = () => {
    navigate('/trip/new');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Your Road Trip Adventures
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and enjoy AI-generated soundtracks for your journeys
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Credits Display */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-card border border-border">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">
              {balance?.available_credits || 0} credits available
            </span>
          </div>

          {/* Only show header CTA when user has trips */}
          {trips.length > 0 && (
            <Button onClick={handleCreateTrip} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Capture a Memory
            </Button>
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      {trips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gradient-card border border-border rounded-xl p-4">
            <div className="text-2xl font-bold text-foreground">{trips.length}</div>
            <div className="text-sm text-muted-foreground">Total Trips</div>
          </div>
          
          <div className="bg-gradient-card border border-border rounded-xl p-4">
            <div className="text-2xl font-bold text-foreground">
              {trips.reduce((total, trip) => total + trip.stops.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Stops</div>
          </div>
          
          <div className="bg-gradient-card border border-border rounded-xl p-4">
            <div className="text-2xl font-bold text-foreground">
              {balance?.total_used || 0}
            </div>
            <div className="text-sm text-muted-foreground">Songs Generated</div>
          </div>
        </motion.div>
      )}

      {/* Trips Grid */}
      {trips.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No musical memories yet"
          description="Start capturing your adventures! Each stop becomes a unique song that tells your story."
          actionLabel="Capture Your First Memory"
          onAction={handleCreateTrip}
        />
      )}
    </div>
  );
};