
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Song, GENRES } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SongEditModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (songId: string, updates: Partial<Song>) => Promise<void>;
}

export const SongEditModal = ({ song, isOpen, onClose, onSave }: SongEditModalProps) => {
  const [formData, setFormData] = useState({
    title: song?.title || '',
    genre: song?.genre || '',
    stories: song?.stories || '',
    people: song?.people || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!song) return;

    setSaving(true);
    try {
      await onSave(song.id, formData);
      toast({
        title: "Song Updated",
        description: "Your changes have been saved successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update song. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!song) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Song Title</Label>
            <InputField
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter song title"
            />
          </div>

          <div>
            <Label htmlFor="genre">Genre</Label>
            <Select 
              value={formData.genre} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="people">People</Label>
            <InputField
              id="people"
              value={formData.people}
              onChange={(e) => setFormData(prev => ({ ...prev, people: e.target.value }))}
              placeholder="Who was with you?"
            />
          </div>

          <div>
            <Label htmlFor="stories">Stories & Memories</Label>
            <Textarea
              id="stories"
              value={formData.stories}
              onChange={(e) => setFormData(prev => ({ ...prev, stories: e.target.value }))}
              placeholder="Share the story behind this song..."
              className="min-h-20"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
