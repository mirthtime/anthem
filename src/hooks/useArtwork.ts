import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

export const useArtwork = () => {
  const generateSongArtwork = async (songId: string, songTitle: string, stopName: string, genre: string, stories: string) => {
    try {
      const prompt = `Create album artwork for a ${genre} song titled "${songTitle}" about ${stories} at ${stopName}. Style: vibrant, musical, artistic, album cover design, high quality, professional music artwork`;
      
      console.log('Generating song artwork:', { songId, prompt });
      
      const { data, error } = await supabase.functions.invoke('generate-artwork', {
        body: {
          songId,
          type: 'song',
          prompt
        }
      });

      if (error) {
        console.error('Artwork generation error:', error);
        toast({
          title: "Artwork Generation Failed",
          description: "Failed to generate song artwork. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (data.success) {
        toast({
          title: "Artwork Generated!",
          description: "Song artwork has been created successfully.",
        });
        return data.artwork_url;
      }

      return null;
    } catch (error) {
      console.error('Error generating song artwork:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating artwork.",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateTripArtwork = async (tripId: string, tripTitle: string, stops: any[], songCount: number) => {
    try {
      const stopNames = stops.map(stop => stop.name).join(', ');
      const prompt = `Create album artwork for a road trip album titled "${tripTitle}" featuring ${songCount} songs from locations: ${stopNames}. Style: road trip vibes, adventure, musical journey, album cover design, high quality, professional music artwork`;
      
      console.log('Generating trip artwork:', { tripId, prompt });
      
      const { data, error } = await supabase.functions.invoke('generate-artwork', {
        body: {
          tripId,
          type: 'trip',
          prompt
        }
      });

      if (error) {
        console.error('Trip artwork generation error:', error);
        toast({
          title: "Artwork Generation Failed",
          description: "Failed to generate trip artwork. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (data.success) {
        toast({
          title: "Trip Artwork Generated!",
          description: "Trip album artwork has been created successfully.",
        });
        return data.artwork_url;
      }

      return null;
    } catch (error) {
      console.error('Error generating trip artwork:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating trip artwork.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    generateSongArtwork,
    generateTripArtwork
  };
};