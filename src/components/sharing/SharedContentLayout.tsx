
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

interface SharedContentLayoutProps {
  children: ReactNode;
}

export const SharedContentLayout = ({ children }: SharedContentLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Music className="h-4 w-4" />
              <span>Shared from TripTunes AI</span>
            </div>
          </div>

          {children}

          {/* Footer */}
          <div className="text-center border-t border-border pt-8 mt-16">
            <p className="text-muted-foreground">
              Created with{' '}
              <a 
                href="https://triptunes.ai" 
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                TripTunes AI
              </a>
              {' '}• Generate your own road trip soundtrack
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
