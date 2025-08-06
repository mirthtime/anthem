import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Song, Trip } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useArtwork = () => {
  const [loading, setLoading] = useState(false);

  const generateSongArtworkPrompt = (song: Song): string => {
    const basePrompt = `Create vibrant, artistic album cover artwork for a song called "${song.title}" in the ${song.genre} genre`;
    
    let prompt = basePrompt;
    
    if (song.stories) {
      prompt += `, inspired by the story: ${song.stories}`;
    }
    
    if (song.people) {
      prompt += `, featuring themes related to ${song.people}`;
    }
    
    prompt += `. The artwork should be colorful, emotional, and capture the essence of a road trip memory at ${song.stop_name}. Style: modern album cover art, high quality, detailed, artistic`;
    
    return prompt;
  };

  const generateTripArtworkPrompt = (trip: Trip, songCount: number): string => {
    const stopNames = trip.stops.map(stop => stop.name).join(', ');
    
    let prompt = `Create beautiful album cover artwork for a road trip album called "${trip.title}"`;
    
    if (trip.description) {
      prompt += `, ${trip.description}`;
    }
    
    if (stopNames) {
      prompt += `. The journey includes stops at: ${stopNames}`;
    }
    
    prompt += `. This album contains ${songCount} songs capturing memories from this adventure. Style: road trip vibes, scenic, nostalgic, album cover art, high quality, artistic, colorful`;
    
    return prompt;
  };

  const generateSongArtwork = async (song: Song): Promise<string | null> => {
    try {
      setLoading(true);
      
      // Mark as generating
      await supabase
        .from('songs')
        .update({ artwork_generating: true })
        .eq('id', song.id);

      const prompt = generateSongArtworkPrompt(song);
      
      const { data, error } = await supabase.functions.invoke('generate-artwork', {
        body: { 
          prompt, 
          type: 'song',
          width: 512,
          height: 512
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        // Update song with artwork URL
        await supabase
          .from('songs')
          .update({ 
            artwork_url: data.imageUrl,
            artwork_generating: false 
          })
          .eq('id', song.id);

        toast({
          title: "Artwork Generated",
          description: `Album artwork created for "${song.title}"`,
        });

        return data.imageUrl;
      } else {
        throw new Error('No image URL returned from generation');
      }

    } catch (error) {
      console.error('Error generating song artwork:', error);
      
      // Reset generating flag
      await supabase
        .from('songs')
        .update({ artwork_generating: false })
        .eq('id', song.id);

      toast({
        title: "Artwork Generation Failed",
        description: "Failed to generate artwork. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateTripArtwork = async (trip: Trip, songCount: number): Promise<string | null> => {
    try {
      setLoading(true);
      
      // Mark as generating
      await supabase
        .from('trips')
        .update({ artwork_generating: true })
        .eq('id', trip.id);

      const prompt = generateTripArtworkPrompt(trip, songCount);
      
      const { data, error } = await supabase.functions.invoke('generate-artwork', {
        body: { 
          prompt, 
          type: 'trip',
          width: 1024,
          height: 1024
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        // Update trip with artwork URL
        await supabase
          .from('trips')
          .update({ 
            artwork_url: data.imageUrl,
            artwork_generating: false 
          })
          .eq('id', trip.id);

        toast({
          title: "Album Artwork Generated",
          description: `Album cover created for "${trip.title}"`,
        });

        return data.imageUrl;
      } else {
        throw new Error('No image URL returned from generation');
      }

    } catch (error) {
      console.error('Error generating trip artwork:', error);
      
      // Reset generating flag
      await supabase
        .from('trips')
        .update({ artwork_generating: false })
        .eq('id', trip.id);

      toast({
        title: "Album Artwork Generation Failed",
        description: "Failed to generate album artwork. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateSongArtwork,
    generateTripArtwork,
    loading
  };
};