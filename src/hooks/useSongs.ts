import { useState, useEffect, useCallback } from 'react';
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
      // First create the song record with status 'generating'
      const { data: song, error: songError } = await supabase
        .from('songs')
        .insert([{
          ...songData,
          user_id: user?.id || null,
          status: 'generating',
          audio_url: null
        }])
        .select()
        .single();

      if (songError) throw songError;

      // Start artwork generation in parallel
      if (song) {
        generateSongArtwork(song);
      }

      // Call the Edge Function to generate the actual song
      try {
        // Invoke the generation function
        const { data, error } = await supabase.functions.invoke('generate-song', {
          body: {
            stopName: songData.stop_name,
            people: songData.people,
            stories: songData.stories,
            genre: songData.genre,
            userId: user?.id || null,
            songId: song.id
          }
        });

        if (error) throw error;
        
        // Poll for completion - the Edge Function runs async
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max wait
        let finalSong = null;
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          
          const { data: checkSong, error: checkError } = await supabase
            .from('songs')
            .select('*')
            .eq('id', song.id)
            .single();
            
          if (checkError) {
            console.error('Error checking song status:', checkError);
          } else if (checkSong) {
            if (checkSong.status === 'completed' && checkSong.audio_url) {
              finalSong = checkSong;
              break;
            } else if (checkSong.status === 'failed') {
              throw new Error(checkSong.error_message || 'Song generation failed');
            }
          }
          
          attempts++;
        }
        
        if (!finalSong) {
          throw new Error('Song generation timed out');
        }
        
        // Refresh songs to update the list
        await fetchSongs();
        
        return finalSong;
      } catch (generateError) {
        // If generation fails, update the song status
        await supabase
          .from('songs')
          .update({ 
            status: 'failed',
            error_message: generateError.message || 'Failed to generate song' 
          })
          .eq('id', song.id);
          
        // Still refresh to show the failed status
        await fetchSongs();
        
        throw generateError;
      }
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

  const regenerateSong = async (song: Song) => {
    try {
      // Update song status to generating
      await supabase
        .from('songs')
        .update({ 
          status: 'generating',
          error_message: null 
        })
        .eq('id', song.id);

      // Call the Edge Function to regenerate the song
      const { data, error } = await supabase.functions.invoke('generate-song', {
        body: {
          stopName: song.stop_name,
          people: song.people,
          stories: song.stories,
          genre: song.genre,
          userId: song.user_id || null,
          songId: song.id
        }
      });

      if (error) throw error;
      
      // Poll for completion
      let attempts = 0;
      const maxAttempts = 60;
      let finalSong = null;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const { data: checkSong, error: checkError } = await supabase
          .from('songs')
          .select('*')
          .eq('id', song.id)
          .single();
          
        if (checkError) {
          console.error('Error checking song status:', checkError);
        } else if (checkSong) {
          if (checkSong.status === 'completed' && checkSong.audio_url) {
            finalSong = checkSong;
            break;
          } else if (checkSong.status === 'failed') {
            throw new Error(checkSong.error_message || 'Song regeneration failed');
          }
        }
        
        attempts++;
      }
      
      if (!finalSong) {
        throw new Error('Song regeneration timed out');
      }
      
      // Generate new artwork for the regenerated song
      generateSongArtwork(finalSong);
      
      // Refresh songs
      await fetchSongs();
      
      return finalSong;
    } catch (error) {
      console.error('Error regenerating song:', error);
      
      // Update song status to failed
      await supabase
        .from('songs')
        .update({ 
          status: 'failed',
          error_message: error.message || 'Failed to regenerate song' 
        })
        .eq('id', song.id);
        
      await fetchSongs();
      
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
    regenerateSong,
    deleteSong,
    updateSong,
    refreshSongs: fetchSongs
  };
};