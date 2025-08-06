import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useArtwork } from './useArtwork';
import { Song } from '@/types';

export const useSongs = (tripId?: string) => {
  const { user } = useAuth();
  const { generateSongArtwork } = useArtwork();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    if (!user && !tripId) {
      setSongs([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('songs')
        .select('*');

      if (tripId) {
        query = query.eq('trip_id', tripId);
      } else if (user) {
        query = query.or(`user_id.eq.${user.id},user_id.is.null`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSong = async (songData: Omit<Song, 'id' | 'created_at' | 'audio_url' | 'lyrics' | 'artwork_url' | 'artwork_generating'>) => {
    try {
      // First create the song record
      const { data: song, error: songError } = await supabase
        .from('songs')
        .insert([{
          ...songData,
          user_id: user?.id || null
        }])
        .select()
        .single();

      if (songError) throw songError;

      // TODO: When ElevenLabs is ready, call the generation function
      // For now, just return the created song record
      await fetchSongs();
      
      // Generate artwork for the song
      if (song) {
        generateSongArtwork(song);
      }
      
      return song;
    } catch (error) {
      console.error('Error generating song:', error);
      throw error;
    }
  };

  const deleteSong = async (id: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  };

  const updateSong = async (id: string, updates: Partial<Song>) => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchSongs();
      return data;
    } catch (error) {
      console.error('Error updating song:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [user, tripId]);

  return {
    songs,
    loading,
    generateSong,
    deleteSong,
    updateSong,
    refreshSongs: fetchSongs
  };
};