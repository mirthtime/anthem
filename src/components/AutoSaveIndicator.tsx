
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
}

export const AutoSaveIndicator = ({ isSaving, lastSaved }: AutoSaveIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1"
          >
            <Save className="h-3 w-3 animate-pulse" />
            <span>Saving...</span>
          </motion.div>
        ) : lastSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1"
          >
            <Check className="h-3 w-3 text-green-500" />
            <span>Saved {formatDistanceToNow(lastSaved)} ago</span>
          </motion.div>
        ) : (
          <motion.div
            key="unsaved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            <span>Not saved</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
