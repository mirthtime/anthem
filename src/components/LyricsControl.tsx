import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextareaField } from '@/components/ui/textarea-field';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';

interface LyricsControlProps {
  customLyrics: string;
  useCustomLyrics: boolean;
  onLyricsChange: (lyrics: string) => void;
  onToggleCustom: (useCustom: boolean) => void;
  generatedStory: string;
}

export const LyricsControl = ({
  customLyrics,
  useCustomLyrics,
  onLyricsChange,
  onToggleCustom,
  generatedStory
}: LyricsControlProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Advanced Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <FileText className="h-4 w-4" />
          Advanced: Lyrics Control
          {isExpanded ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
        </Button>
        
        {isExpanded && (
          <Badge variant="outline" className="text-xs">
            Optional
          </Badge>
        )}
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="space-y-4 p-4 rounded-xl border border-border bg-accent/20">
          {/* Auto vs Custom Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onToggleCustom(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                !useCustomLyrics
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Auto Generate
            </button>
            
            <button
              onClick={() => onToggleCustom(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                useCustomLyrics
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              Write My Own
            </button>
          </div>

          {/* Auto Mode Description */}
          {!useCustomLyrics && (
            <div className="p-3 rounded-lg bg-gradient-primary/5 border border-primary/20">
              <p className="text-sm text-foreground">
                <strong>Auto Mode:</strong> We'll create lyrics based on your story about "{generatedStory.slice(0, 50)}..."
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                The AI will turn your memories into verse, chorus, and bridge sections.
              </p>
            </div>
          )}

          {/* Custom Lyrics Input */}
          {useCustomLyrics && (
            <div className="space-y-3">
              <TextareaField
                label="Your Custom Lyrics"
                placeholder={`[Verse 1]
We rolled into ${generatedStory.includes('Austin') ? 'Austin' : 'town'} when the sun was high
${generatedStory.includes('Brad') ? 'Brad' : 'We'} fired up the grill...

[Chorus]
These are the days we'll remember
Rolling down the highway together...

[Verse 2]
...`}
                value={customLyrics}
                onChange={(e) => onLyricsChange(e.target.value)}
                rows={8}
              />
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>💡 <strong>Tips for great lyrics:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Use [Verse 1], [Chorus], [Bridge] structure</li>
                  <li>Include specific names and places from your story</li>
                  <li>Keep verses narrative, make chorus catchy/emotional</li>
                  <li>Rhyming helps but isn't required</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};