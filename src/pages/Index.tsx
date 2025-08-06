import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripStopForm } from '@/components/TripStopForm';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Music, MapPin, LogOut, Plus, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showStopForm, setShowStopForm] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleStopSubmit = async (data: {
    stopName: string;
    people: string;
    stories: string;
    genre: string;
    duration: number;
  }) => {
    setGeneratingAudio(true);
    
    // TODO: Call ElevenLabs API to generate song
    toast({
      title: "Coming Soon!",
      description: "Song generation will be implemented with ElevenLabs API",
    });
    
    setTimeout(() => {
      setGeneratingAudio(false);
      setShowStopForm(false);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-primary">
                <Music className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              TripTunes AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Generate personalized road trip soundtracks with AI
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/auth">
              <Button size="lg" className="w-full max-w-md">
                Start Your Trip
              </Button>
            </Link>
            
            <div className="text-sm text-muted-foreground">
              <p>✨ Free: 3 songs per trip</p>
              <p>🎵 Premium: Unlimited songs & longer tracks</p>
            </div>
          </div>
        </motion.div>
        <PWAInstallPrompt />
      </div>
    );
  }

  if (showStopForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowStopForm(false)}
            >
              ← Back
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          <TripStopForm 
            onSubmit={handleStopSubmit}
            loading={generatingAudio}
          />
        </div>
        <PWAInstallPrompt />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-primary">
              <Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">TripTunes</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <History className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Welcome back!</CardTitle>
              <CardDescription>
                Ready to create your next road trip soundtrack?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  onClick={() => setShowStopForm(true)}
                  className="h-20 flex-col gap-2"
                >
                  <Plus className="h-6 w-6" />
                  Add Your First Stop
                  <span className="text-xs opacity-90">Build songs as you travel</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="h-20 flex-col gap-2"
                >
                  <MapPin className="h-6 w-6" />
                  Plan Full Trip
                  <span className="text-xs opacity-90">Map out your journey</span>
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground text-center pt-4 border-t border-border">
                💡 Pro tip: Add stops after each visit for the most personalized songs
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Trips Section - Empty state for now */}
        <div className="text-center py-12 text-muted-foreground">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Your trip songs will appear here</p>
        </div>
      </div>
      
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
