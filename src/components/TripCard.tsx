
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Music, Calendar, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trip } from '@/types';
import { useTrips } from '@/hooks/useTrips';
import { useSongs } from '@/hooks/useSongs';
import { TripSharingDropdown } from '@/components/sharing/TripSharingDropdown';
import { toast } from '@/hooks/use-toast';

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();
  const { deleteTrip, duplicateTrip } = useTrips();
  const { songs } = useSongs(trip.id);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewTrip = () => {
    navigate(`/trip/${trip.id}`);
  };

  const handleEditTrip = () => {
    navigate(`/trip/${trip.id}/edit`);
  };

  const handleDuplicateTrip = async () => {
    try {
      await duplicateTrip(trip);
      toast({
        title: "Trip Duplicated",
        description: "Your trip has been successfully duplicated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate trip. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTrip = async () => {
    if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTrip(trip.id);
      toast({
        title: "Trip Deleted",
        description: "Your trip has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="h-full bg-gradient-card border-border shadow-card hover:shadow-button transition-all duration-200 cursor-pointer group"
        onClick={handleViewTrip}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {trip.title}
              </h3>
              {trip.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {trip.description}
                </p>
              )}
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TripSharingDropdown trip={trip} songCount={songs.length} />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditTrip(); }}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Trip
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateTrip(); }}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); handleDeleteTrip(); }}
                    className="text-destructive focus:text-destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Trip Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{trip.stops.length} stops</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Music className="h-4 w-4" />
                <span>{songs.length} songs</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(trip.created_at)}</span>
              </div>
            </div>

            {/* Recent Stops Preview */}
            {trip.stops.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Recent Stops:</h4>
                <div className="flex flex-wrap gap-1">
                  {trip.stops.slice(0, 3).map((stop, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {stop.name}
                    </Badge>
                  ))}
                  {trip.stops.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{trip.stops.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleViewTrip();
              }}
            >
              View Trip Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
