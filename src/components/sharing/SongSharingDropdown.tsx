
import { useState } from 'react';
import { Copy, ExternalLink, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Song } from '@/types';
import { useSharing } from '@/hooks/useSharing';
import { toast } from '@/hooks/use-toast';

interface SongSharingDropdownProps {
  song: Song;
  triggerSize?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

export const SongSharingDropdown = ({ 
  song, 
  triggerSize = 'sm',
  variant = 'outline' 
}: SongSharingDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    generateShareableUrl, 
    copyToClipboard, 
    downloadAudio, 
    shareToTwitter, 
    generateSongCaption 
  } = useSharing();

  const handleCopyLink = async () => {
    const shareUrl = generateShareableUrl('song', song.id);
    await copyToClipboard(shareUrl, 'Song link copied to clipboard!');
    setIsOpen(false);
  };

  const handleCopyCaption = async () => {
    const caption = generateSongCaption(song.title, song.stop_name, song.genre);
    await copyToClipboard(caption, 'Caption copied to clipboard!');
    setIsOpen(false);
  };

  const handleShareToTwitter = () => {
    const shareUrl = generateShareableUrl('song', song.id);
    const description = generateSongCaption(song.title, song.stop_name, song.genre);
    shareToTwitter({
      title: song.title,
      description,
      url: shareUrl,
      audioUrl: song.audio_url || undefined,
      type: 'song'
    });
    setIsOpen(false);
  };

  const handleDownload = async () => {
    if (!song.audio_url) {
      toast({
        title: "No Audio Available",
        description: "This song doesn't have an audio file to download.",
        variant: "destructive",
      });
      return;
    }
    
    await downloadAudio(song.audio_url, `${song.title} - ${song.stop_name}`);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size={triggerSize} variant={variant}>
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Song Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyCaption}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Caption
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleShareToTwitter}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download Audio
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
