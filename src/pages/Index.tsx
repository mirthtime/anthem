import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripStopForm } from '@/components/TripStopForm';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Music, MapPin, LogOut, Plus, History, Play, Headphones, Sparkles, Star, Users, ChevronRight, Volume2, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-road-trip.jpg';
import campfireImage from '@/assets/campfire-memories.jpg';
import highwayImage from '@/assets/highway-dance.jpg';
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showStopForm, setShowStopForm] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);

  // Initialize scroll animations
  useScrollAnimations();

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
        <FloatingMusicNotes />
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

        {/* Hero Section with Mobile-Optimized Background */}
        <section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-32 overflow-hidden min-h-[90vh] flex items-center">
          {/* Background Image with Mobile Optimization */}
          <div className="absolute inset-0 z-0">
            {/* Desktop/Tablet Hero Image */}
            <img 
              src={heroImage} 
              alt="Friends on a road trip" 
              className="hidden sm:block w-full h-full object-cover object-center"
            />
            {/* Mobile: Darker gradient overlay for better text readability */}
            <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
            <div className="hidden sm:block absolute inset-0 hero-overlay"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-6 sm:mb-8">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">Every Adventure Needs A Soundtrack</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-2xl px-2">
                Build Your Trip's
                <span className="block text-transparent bg-clip-text bg-gradient-sunset animate-shimmer mt-2">
                  Soundtrack
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
                Every road trip deserves its own soundtrack. <span className="text-primary font-medium heartbeat">Capture each stop, each adventure, each magical moment</span> and turn them into songs that bring you right back to mile marker one.
              </p>
              
              <div className="bg-card/70 sm:bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8 sm:mb-12 max-w-2xl mx-auto shadow-card-hover">
                <p className="text-base sm:text-lg text-foreground mb-3 sm:mb-4 font-medium">
                  Document your journey, one song per stop:
                </p>
                <div className="space-y-2 sm:space-y-3 text-left">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground">"We stopped in <span className="text-accent font-medium">Austin</span>, explored 6th Street until 3am, and Jake somehow convinced a street musician to let him play drums..."</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground">"<span className="text-accent font-medium">Grand Canyon sunrise</span> with my best friend, coffee in hand, realizing this moment was worth the 6-hour drive..."</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground">"Got lost outside <span className="text-accent font-medium heartbeat">Nashville</span>, ended up at a dive bar where the locals taught us to line dance until our sides hurt..."</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shine-button shadow-glow">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Start Creating Music
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  <Headphones className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Listen to Examples
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid with Images */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
               <h2 className="text-3xl lg:text-4xl font-bold mb-4">Turn Every <span className="text-transparent bg-clip-text bg-gradient-sunset heartbeat">Mile Into Music</span></h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                 Document your journey one stop at a time. Create songs that capture <span className="text-primary font-medium">roadside diners, sunrise views, getting lost, and finding yourself</span> along the way.
               </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  icon: MapPin,
                  title: "Document Each Stop",
                  description: "Share the quirky roadside diners, breathtaking overlooks, and unexpected detours that made your trip unforgettable",
                  image: campfireImage,
                  emotional: true
                },
                {
                  step: "02", 
                  icon: Sparkles,
                  title: "Build Your Soundtrack",
                  description: "We transform each stop into a unique song that captures the exact vibe, mood, and energy of that moment in your journey",
                  image: null,
                  emotional: false
                },
                {
                  step: "03",
                  icon: Music,
                  title: "Your Trip Album",
                  description: "Years later, your playlist will instantly transport you back to the open road—mile by mile, memory by memory",
                  image: highwayImage,
                  emotional: true
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  className="scroll-scale-in"
                >
                  <Card className={`relative h-full bg-gradient-card border-border shadow-card hover:shadow-card-hover interactive-card overflow-hidden group ${feature.emotional ? 'hover:shadow-glow' : ''}`}>
                    {feature.image && (
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-sunset text-white text-sm sm:text-lg font-bold flex items-center justify-center shadow-glow z-10">
                      {feature.step}
                    </div>
                    <CardContent className="relative z-10 p-6 sm:p-8 pt-16 sm:pt-20">
                      <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                          <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className={`text-xl font-semibold mb-4 text-center ${feature.emotional ? 'heartbeat' : ''}`}>{feature.title}</h3>
                      <p className="text-muted-foreground text-center leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Emotional Testimonials Section */}
        <section className="px-6 py-20 scroll-fade-in">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Real Stories, <span className="text-transparent bg-clip-text bg-gradient-sunset heartbeat">Real Emotions</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every song tells a story. Here's how music has helped others capture their most precious moments.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Users, 
                  stat: "10K+", 
                  label: "Travelers Creating Music",
                  story: "From first dates to last goodbyes"
                },
                { 
                  icon: Music, 
                  stat: "50K+", 
                  label: "Songs Generated",
                  story: "Each one a unique memory time capsule"
                }, 
                { 
                  icon: Star, 
                  stat: "4.9★", 
                  label: "Average Rating",
                  story: "\"It perfectly captured how I felt that day\""
                }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="text-center scroll-scale-in enhanced-glow rounded-2xl p-6 bg-card/50 backdrop-blur border border-border interactive-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2 heartbeat">{item.stat}</div>
                  <div className="text-muted-foreground mb-2">{item.label}</div>
                  <div className="text-sm text-primary italic">{item.story}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Songs */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center mb-12 scroll-fade-in"
            >
               <h2 className="text-3xl lg:text-4xl font-bold mb-4">Hear The <span className="text-transparent bg-clip-text bg-gradient-sunset">Magic</span></h2>
               <p className="text-xl text-muted-foreground">
                 Real songs that take travelers back to their <span className="text-primary font-medium heartbeat">most cherished moments</span>
               </p>
            </motion.div>

            <div className="space-y-4 scroll-fade-in">
              {[
                { title: "First Kiss in Paris", subtitle: "Acoustic • France • The night everything changed", duration: "3:42" },
                { title: "Graduation Road Trip", subtitle: "Indie Folk • Route 66 • Freedom & friendship", duration: "2:58" },
                { title: "Wedding Sunrise", subtitle: "Orchestral • Tuscany • Forever starts here", duration: "4:15" }
              ].map((song, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  >
                    <Card className="bg-gradient-card border-border hover:border-primary/30 interactive-card cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-gradient-sunset flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Play className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">{song.title}</h3>
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
                     Ready to <span className="text-transparent bg-clip-text bg-gradient-sunset heartbeat">Lock In Your Memories?</span>
                   </h2>
                   <p className="text-xl text-muted-foreground mb-8">
                     Create songs that will take you back to <span className="text-primary font-medium">these moments of pure joy, love, and adventure</span> for years to come. Start with 3 free songs.
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
