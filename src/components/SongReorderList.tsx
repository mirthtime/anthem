
import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GripVertical, Music, Save, X } from 'lucide-react';
import { Song } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SongReorderListProps {
  songs: Song[];
  isOpen: boolean;
  onClose: () => void;
  onReorder: (reorderedSongs: Song[]) => Promise<void>;
}

export const SongReorderList = ({ songs, isOpen, onClose, onReorder }: SongReorderListProps) => {
  const [reorderedSongs, setReorderedSongs] = useState(songs);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onReorder(reorderedSongs);
      toast({
        title: "Songs Reordered",
        description: "Your song order has been updated successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder songs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(songs.map(s => s.id)) !== JSON.stringify(reorderedSongs.map(s => s.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Reorder Songs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder your songs. The new order will be reflected throughout your trip album.
          </p>

          <div className="max-h-96 overflow-y-auto space-y-2">
            <Reorder.Group axis="y" values={reorderedSongs} onReorder={setReorderedSongs}>
              {reorderedSongs.map((song, index) => (
                <Reorder.Item key={song.id} value={song}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-medium">
                              {index + 1}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              {song.artwork_url ? (
                                <img 
                                  src={song.artwork_url} 
                                  alt={`${song.title} artwork`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                                  <Music className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {song.title}
                              </h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {song.stop_name}
                              </p>
                            </div>
                          </div>
                          
                          <Badge variant="secondary">{song.genre}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || !hasChanges} 
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
