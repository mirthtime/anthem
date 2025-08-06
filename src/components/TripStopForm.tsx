import { useState } from 'react';
import { motion } from 'framer-motion';
import { InputField } from '@/components/ui/input-field';
import { TextareaField } from '@/components/ui/textarea-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GENRES, DURATIONS, Genre, Duration } from '@/types';
import { Loader2, Music } from 'lucide-react';

interface TripStopFormProps {
  onSubmit: (data: {
    stopName: string;
    people: string;
    stories: string;
    genre: Genre;
    duration: Duration;
  }) => void;
  loading?: boolean;
}

export const TripStopForm = ({ onSubmit, loading = false }: TripStopFormProps) => {
  const [stopName, setStopName] = useState('');
  const [people, setPeople] = useState('');
  const [stories, setStories] = useState('');
  const [genre, setGenre] = useState<Genre>('Rock');
  const [duration, setDuration] = useState<Duration>(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      stopName,
      people,
      stories,
      genre,
      duration,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-primary">
              <Music className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Add a Stop to Your Trip</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Stop Name"
              value={stopName}
              onChange={(e) => setStopName(e.target.value)}
              placeholder="e.g., Austin, Nashville, Route 66..."
              required
            />

            <InputField
              label="Who Was There"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              placeholder="e.g., Sarah, Mike, best friends..."
            />

            <TextareaField
              label="What Happened"
              value={stories}
              onChange={(e) => setStories(e.target.value)}
              placeholder="Tell us about your adventures, funny moments, discoveries..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Genre/Style
                </label>
                <Select value={genre} onValueChange={(value: Genre) => setGenre(value)}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Song Length
                </label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value) as Duration)}>
                  <SelectTrigger className="rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}s {d >= 90 ? '(Premium)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || !stopName.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Your Song...
                </>
              ) : (
                'Generate Song'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};