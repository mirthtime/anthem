import { toast } from './use-toast';

export interface ShareableContent {
  title: string;
  description: string;
  url: string;
  audioUrl?: string;
  type: 'trip' | 'song';
}

export const useSharing = () => {
  const generateShareableUrl = (type: 'trip' | 'song', id: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${type}/${id}`;
  };

  const copyToClipboard = async (text: string, successMessage: string = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: successMessage,
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Success",
        description: successMessage,
      });
    }
  };

  const downloadAudio = async (audioUrl: string, filename: string) => {
    try {
      // Create a temporary anchor element to trigger download
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your audio file is downloading!",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the audio file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareToTwitter = (content: ShareableContent) => {
    const hashtags = content.type === 'song' ? 'TripTunesAI,roadtrip,music,AI' : 'TripTunesAI,roadtrip,travel';
    const text = `${content.description} 🎵✨`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(content.url)}&hashtags=${hashtags}`;
    window.open(url, '_blank');
  };

  const generateSongCaption = (songTitle: string, stopName: string, genre: string) => {
    return `Just generated "${songTitle}" - a ${genre} song inspired by ${stopName} with TripTunes AI! 🎵✨ Perfect soundtrack for any adventure. #TripTunesAI #roadtrip #music #AI`;
  };

  const generateTripCaption = (tripTitle: string, stopCount: number, songCount: number) => {
    return `Created an epic ${stopCount}-stop road trip playlist with ${songCount} AI-generated songs using TripTunes AI! 🚗🎵 Ready for the ultimate adventure soundtrack! #TripTunesAI #roadtrip #travel`;
  };

  return {
    generateShareableUrl,
    copyToClipboard,
    downloadAudio,
    shareToTwitter,
    generateSongCaption,
    generateTripCaption,
  };
};