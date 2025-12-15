import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Music, Sparkles, Mic, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SongGenerationLoaderProps {
  isVisible: boolean;
  songName?: string;
  genre?: string;
}

export const SongGenerationLoader = ({ isVisible, songName, genre }: SongGenerationLoaderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const steps = [
    { icon: Sparkles, text: 'Analyzing your story...', duration: 3 },
    { icon: Music, text: 'Composing melody...', duration: 5 },
    { icon: Mic, text: 'Generating vocals...', duration: 7 },
    { icon: Music, text: 'Mixing and mastering...', duration: 4 },
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <Card className="w-full max-w-md bg-gradient-card border-border shadow-2xl">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <div className="p-4 rounded-full bg-gradient-primary">
                    <Music className="h-10 w-10 text-white" />
                  </div>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Creating Your Song
                </h2>
                
                {songName && (
                  <p className="text-muted-foreground">
                    "{songName}" in {genre} style
                  </p>
                )}
              </div>

              {/* Progress Steps */}
              <div className="space-y-4 mb-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isComplete = index < currentStep;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                        isActive ? 'bg-primary/10 border border-primary/20' : 
                        isComplete ? 'opacity-60' : 'opacity-30'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isActive ? 'bg-primary text-white' : 
                        isComplete ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {isActive ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Time Elapsed */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Time elapsed: {formatTime(elapsedTime)}</span>
              </div>

              {/* Fun Facts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-accent/30 rounded-lg"
              >
                <p className="text-xs text-muted-foreground text-center">
                  💡 Did you know? AI can compose music in over 100 different genres and styles!
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};