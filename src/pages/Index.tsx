import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripStopForm } from '@/components/TripStopForm';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Music, MapPin, LogOut, Plus, History, Play, Headphones, Sparkles, Star, Users, ChevronRight, Volume2 } from 'lucide-react';
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
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-primary shadow-glow">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">TripTunes</span>
            </div>
            <Link to="/auth">
              <Button variant="outline" className="border-border/50 hover:border-primary/50">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Every Adventure Needs A Soundtrack</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                You Know That Song That
                <span className="block text-transparent bg-clip-text bg-gradient-primary animate-shimmer">
                  Takes You Back?
                </span>
              </h1>
              
               <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                 You've probably had that experience of listening to a song and being instantly transported back in time—to the exact place, people, and mood when you first heard it. What if you could intentionally create that magic for your next adventure?
               </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-6 shine-button">
                    <Play className="h-5 w-5 mr-2" />
                    Start Creating Music
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-border/50 hover:border-primary/50">
                  <Headphones className="h-5 w-5 mr-2" />
                  Listen to Examples
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
               <h2 className="text-3xl lg:text-4xl font-bold mb-4">Turn Moments Into Memories</h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                 Create songs that will instantly take you back to exactly how you felt
               </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: MapPin,
                  title: "Capture The Feeling",
                  description: "Share the places you've been, the people you met, and the emotions you felt in that moment"
                },
                {
                  step: "02", 
                  icon: Sparkles,
                  title: "Create Your Time Machine",
                  description: "We compose a unique song that locks in the exact feeling and atmosphere of your experience"
                },
                {
                  step: "03",
                  icon: Music,
                  title: "Relive It Forever",
                  description: "Years from now, one note will instantly transport you back to that exact moment and feeling"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                >
                  <Card className="relative h-full bg-gradient-card border-border shadow-card hover:shadow-card-hover transition-all duration-300 floating-card">
                    <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-primary text-white text-lg font-bold flex items-center justify-center shadow-glow">
                      {feature.step}
                    </div>
                    <CardContent className="p-8 pt-12">
                      <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
                          <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-center">{feature.title}</h3>
                      <p className="text-muted-foreground text-center leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { icon: Users, stat: "10K+", label: "Travelers Creating Music" },
                { icon: Music, stat: "50K+", label: "Songs Generated" }, 
                { icon: Star, stat: "4.9★", label: "Average Rating" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{item.stat}</div>
                  <div className="text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Example Songs */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center mb-12"
            >
               <h2 className="text-3xl lg:text-4xl font-bold mb-4">Hear The Magic</h2>
               <p className="text-xl text-muted-foreground">
                 Real songs that take travelers back to their favorite moments
               </p>
            </motion.div>

            <div className="space-y-4">
              {[
                { title: "Sunset at Grand Canyon", subtitle: "Rock • Arizona • Sarah & Mike", duration: "3:42" },
                { title: "Coffee Shop in Portland", subtitle: "Indie Folk • Oregon • Solo Journey", duration: "2:58" },
                { title: "Beach Bonfire Memories", subtitle: "Pop • California • Friends Trip", duration: "4:15" }
              ].map((song, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                >
                  <Card className="bg-gradient-card border-border hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Play className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{song.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{song.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Volume2 className="h-4 w-4" />
                          <span>{song.duration}</span>
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Card className="bg-gradient-card border-border shadow-card-hover">
                <CardContent className="p-12">
                   <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                     Ready to Lock In Your Memories?
                   </h2>
                   <p className="text-xl text-muted-foreground mb-8">
                     Create songs that will take you back to these moments for years to come. Start with 3 free songs.
                   </p>
                  <Link to="/auth">
                    <Button size="lg" className="text-lg px-12 py-6 shine-button">
                      <Play className="h-5 w-5 mr-2" />
                      Get Started Free
                    </Button>
                  </Link>
                  <div className="flex justify-center gap-8 mt-8 text-sm text-muted-foreground">
                    <span>✨ 3 free songs</span>
                    <span>🎵 No credit card</span>
                    <span>🚀 Instant access</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

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
