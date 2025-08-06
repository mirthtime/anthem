import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Trip, TripStop } from '@/types';

export const useTrips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([{
          ...trip,
          user_id: user?.id || null
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchTrips();
      return data;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchTrips();
      return data;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  };

  const duplicateTrip = async (trip: Trip) => {
    const duplicatedTrip = {
      title: `${trip.title} (Copy)`,
      description: trip.description,
      stops: trip.stops,
      user_id: user?.id || null
    };

    return createTrip(duplicatedTrip);
  };

  const getTripById = async (id: string): Promise<Trip | null> => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching trip:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  return {
    trips,
    loading,
    createTrip,
    updateTrip,
    deleteTrip,
    duplicateTrip,
    getTripById,
    refreshTrips: fetchTrips
  };
};