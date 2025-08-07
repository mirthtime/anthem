import { useState } from 'react';
import { motion } from 'framer-motion';
import { InputField } from '@/components/ui/input-field';
import { TextareaField } from '@/components/ui/textarea-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GENRES, STYLE_SUGGESTIONS, Genre } from '@/types';
import { Loader2, Music, Sparkles } from 'lucide-react';

interface TripStopFormProps {
  onSubmit: (data: {
    stopName: string;
    people: string;
    stories: string;
    genre: string;
    customStyle?: string;
  }) => void;
  loading?: boolean;
}

export const TripStopForm = ({ onSubmit, loading = false }: TripStopFormProps) => {
  const [stopName, setStopName] = useState('');
  const [people, setPeople] = useState('');
  const [stories, setStories] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Rock');
  const [customStyle, setCustomStyle] = useState('');

  const isCustomGenre = selectedGenre === 'Custom';

  const handleSuggestionClick = (suggestion: string) => {
    const currentValue = customStyle || '';
    const newValue = currentValue ? `${currentValue}, ${suggestion}` : suggestion;
    setCustomStyle(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalGenre = isCustomGenre ? 'Custom' : selectedGenre;
    
    onSubmit({
      stopName,
      people,
      stories,
      genre: finalGenre,
      customStyle: isCustomGenre ? customStyle : undefined,
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

            {/* Genre Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Music className="h-4 w-4" />
                Genre *
              </label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Pick a genre" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg z-50 max-h-[200px] overflow-y-auto">
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Style Input - Show when Custom is selected */}
            {isCustomGenre && (
              <div className="space-y-4 p-4 rounded-xl border border-border bg-accent/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-foreground">Custom Style & Instruments</h3>
                </div>
                
                {/* Style Prompt Input */}
                <div className="space-y-2">
                  <TextareaField
                    placeholder="e.g., acoustic guitar, nostalgic, harmonica, folk rock with storytelling vocals"
                    value={customStyle}
                    onChange={(e) => setCustomStyle(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Suggested Tags */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Click to add popular styles to your prompt:
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {STYLE_SUGGESTIONS.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 text-xs rounded-full border transition-all border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary cursor-pointer whitespace-nowrap flex-shrink-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Tip: Be specific! "Acoustic guitar with harmonica and nostalgic vibes" works better than just "country"
                </p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || !stopName.trim() || (isCustomGenre && !customStyle.trim())}
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