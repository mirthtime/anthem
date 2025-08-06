import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const { isInstallable, install } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isInstallable || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-full bg-gradient-primary">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Install TripTunes</h3>
                  <p className="text-xs text-muted-foreground">
                    Get the full native app experience
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleInstall}>
                  Install
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};