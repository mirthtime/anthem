import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X, MapPin, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface QuickNoteInputProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  storytellerColor?: string;
}

const QUICK_PROMPTS = [
  "We just arrived at...",
  "The best part so far was...",
  "I can't believe we...",
  "We discovered...",
  "Everyone laughed when...",
  "The view from here is..."
];

export const QuickNoteInput = ({
  onSubmit,
  onCancel,
  storytellerColor = '#E67E22'
}: QuickNoteInputProps) => {
  const [content, setContent] = useState('');
  const [showPrompts, setShowPrompts] = useState(true);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  const handlePromptClick = (prompt: string) => {
    setContent(prompt);
    setShowPrompts(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div
        className="p-4 rounded-lg border-2"
        style={{ borderColor: storytellerColor + '50' }}
      >
        {/* Quick Prompts */}
        {showPrompts && !content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-3"
          >
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Smile className="h-3 w-3" />
              Quick starters:
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening right now? Capture this moment..."
          className="min-h-[100px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 text-base"
          autoFocus
        />

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1 text-xs text-muted-foreground"
            >
              <MapPin className="h-3 w-3" />
              Add location
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-8"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="h-8 gap-1"
              style={{
                backgroundColor: content.trim() ? storytellerColor : undefined
              }}
            >
              <Send className="h-3 w-3" />
              Save moment
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
