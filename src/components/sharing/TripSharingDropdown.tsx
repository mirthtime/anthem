
import { useState } from 'react';
import { Copy, ExternalLink, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Trip } from '@/types';
import { useSharing } from '@/hooks/useSharing';

interface TripSharingDropdownProps {
  trip: Trip;
  songCount: number;
  triggerSize?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

export const TripSharingDropdown = ({ 
  trip, 
  songCount,
  triggerSize = 'sm',
  variant = 'outline' 
}: TripSharingDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    generateShareableUrl, 
    copyToClipboard, 
    shareToTwitter, 
    generateTripCaption 
  } = useSharing();

  const handleCopyLink = async () => {
    const shareUrl = generateShareableUrl('trip', trip.id);
    await copyToClipboard(shareUrl, 'Trip link copied to clipboard!');
    setIsOpen(false);
  };

  const handleCopyCaption = async () => {
    const caption = generateTripCaption(trip.title, trip.stops.length, songCount);
    await copyToClipboard(caption, 'Caption copied to clipboard!');
    setIsOpen(false);
  };

  const handleShareToTwitter = () => {
    const shareUrl = generateShareableUrl('trip', trip.id);
    const description = generateTripCaption(trip.title, trip.stops.length, songCount);
    shareToTwitter({
      title: trip.title,
      description,
      url: shareUrl,
      type: 'trip'
    });
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
          Copy Trip Link
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
