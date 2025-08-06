import { Badge } from '@/components/ui/badge';
import { TextareaField } from '@/components/ui/textarea-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Sparkles } from 'lucide-react';
import { GENRES, STYLE_SUGGESTIONS } from '@/types';

interface GenreStylePickerProps {
  selectedGenre: string;
  customStyle: string;
  onGenreChange: (genre: string) => void;
  onStyleChange: (style: string) => void;
  error?: string;
}

export const GenreStylePicker = ({ 
  selectedGenre, 
  customStyle, 
  onGenreChange, 
  onStyleChange,
  error 
}: GenreStylePickerProps) => {
  const isCustomGenre = selectedGenre === 'Custom';

  const handleSuggestionClick = (suggestion: string) => {
    const currentValue = customStyle || '';
    const newValue = currentValue ? `${currentValue}, ${suggestion}` : suggestion;
    onStyleChange(newValue);
  };

  return (
    <div className="space-y-4">
      {/* Genre Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Music className="h-4 w-4" />
          Genre *
        </label>
        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder="Pick a genre" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border shadow-lg z-50">
            {GENRES.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>

      {/* Custom Style Input - Show when Custom is selected */}
      {isCustomGenre && (
        <div className="space-y-4 p-4 rounded-xl border border-border bg-accent/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Custom Style & Instruments</h3>
          </div>
          
          {/* Style Prompt Input */}
          <TextareaField
            placeholder="e.g., acoustic guitar, nostalgic, harmonica, folk rock with storytelling vocals"
            value={customStyle}
            onChange={(e) => onStyleChange(e.target.value)}
            rows={3}
            className="resize-none"
          />

          {/* Suggested Tags */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Click to add popular styles to your prompt:
            </p>
            <div className="flex flex-wrap gap-1">
              {STYLE_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 py-1 text-xs rounded-md border transition-all border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary cursor-pointer"
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
    </div>
  );
};