import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { TextareaField } from '@/components/ui/textarea-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Sparkles, X } from 'lucide-react';
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
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const isCustomGenre = selectedGenre === 'Custom';

  const addCustomTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !customTags.includes(trimmedTag)) {
      const newTags = [...customTags, trimmedTag];
      setCustomTags(newTags);
      onStyleChange(newTags.join(', '));
    }
    setTagInput('');
  };

  const removeCustomTag = (tagToRemove: string) => {
    const newTags = customTags.filter(tag => tag !== tagToRemove);
    setCustomTags(newTags);
    onStyleChange(newTags.join(', '));
  };

  const handleSuggestionClick = (suggestion: string) => {
    addCustomTag(suggestion);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCustomTag(tagInput);
    }
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
          
          {/* Current Tags */}
          {customTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customTags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="gap-1 pr-1"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeCustomTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <InputField
            placeholder="e.g., acoustic guitar, nostalgic, harmonica"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
          />
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addCustomTag(tagInput)}
              disabled={!tagInput.trim()}
            >
              Add Tag
            </Button>
          </div>

          {/* Suggested Tags */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Click to add popular styles:
            </p>
            <div className="flex flex-wrap gap-1">
              {STYLE_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={customTags.includes(suggestion)}
                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                    customTags.includes(suggestion)
                      ? 'border-border bg-accent text-muted-foreground cursor-not-allowed'
                      : 'border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary cursor-pointer'
                  }`}
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