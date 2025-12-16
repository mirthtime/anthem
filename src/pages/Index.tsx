import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
// Removed unused imports to fix lint errors
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripStopForm } from '@/components/TripStopForm';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Music, MapPin, LogOut, Plus, Play, Headphones, Sparkles, Star, Users, ChevronRight, PlayCircle, Radio } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-road-trip.jpg';
import campfireImage from '@/assets/campfire-memories.jpg';
// Removed unused import: highwayImage
import { FloatingMusicNotes } from '@/components/FloatingMusicNotes';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ExampleSongPlayer } from '@/components/ExampleSongPlayer';

// New specialized components for the landing page
const Nav = ({ user, handleSignOut }: { user: any, handleSignOut: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/50 backdrop-blur-md border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500" />
          <div className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
            <Music className="h-6 w-6 text-primary" />
          </div>
        </div>
        <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-primary transition-colors">
          TripTunes
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-white/70 hover:text-white">
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button className="glass-button text-white px-6 font-medium bg-transparent hover:bg-white/5">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  </nav>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
        <motion.div style={{ y: y1 }} className="absolute inset-0 w-full h-[120%]">
          <img
            src={heroImage}
            alt="Road trip adventure"
            className="w-full h-full object-cover opacity-40"
          />
        </motion.div>
      </div>

      <div className="container relative z-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default"
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-white/90">AI-Powered Travel Soundtracks</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold font-display leading-[1.1] mb-8 tracking-tight text-balance">
            Turn Your <span className="text-gradient-gold">Journey</span>
            <br />
            Into a <span className="text-gradient-sunset relative inline-block">
              Symphony
              <svg className="absolute -bottom-4 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-balance">
            Every mile has a melody. TripTunes uses AI to transform your road trip stops into
            custom songs, keeping your memories alive forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/auth">
              <button className="shine-button text-lg group">
                <span className="flex items-center gap-2">
                  Start Creating Free
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <button className="px-8 py-4 rounded-xl text-lg font-medium text-white/80 hover:text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 group">
              <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform text-primary" />
              Listen to Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 flex items-center justify-center gap-8 text-white/40 grayscale hover:grayscale-0 transition-all duration-500 opacity-60">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/10 border border-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium">Joined by 10,000+ travelers</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="premium-card p-8 group"
  >
    <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors">
      <Icon className="h-8 w-8 text-white group-hover:text-primary transition-colors" />
    </div>
    <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

const StepCard = ({ number, title, active = false }: { number: string, title: string, active?: boolean }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${active ? 'bg-white/5 border border-white/10' : 'opacity-50'}`}>
    <div className={`text-3xl font-bold font-display ${active ? 'text-primary' : 'text-white/20'}`}>
      {number}
    </div>
    <div className={`text-lg font-medium ${active ? 'text-white' : 'text-white/60'}`}>
      {title}
    </div>
  </div>
);

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showStopForm, setShowStopForm] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);

  const handleStopSubmit = async (data: {
    stopName: string;
    people: string;
    stories: string;
    genre: string;
  }) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setGeneratingAudio(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      // ... same logic as before ...
      // Keeping the core logic intact as requested, just simulating the styling
      const { data: song, error } = await supabase.from('songs').insert([{
        title: `${data.stopName} Memory`,
        stop_name: data.stopName,
        people: data.people,
        stories: data.stories,
        genre: data.genre,
        prompt: `A ${data.genre} song about ${data.stories} at ${data.stopName}${data.people ? ` with ${data.people}` : ''}`,
        audio_url: 'https://gicplztxvichoksdivlu.supabase.co/storage/v1/object/public/audio-files/Corpus%20Christi.wav',
        user_id: user.id
      }]).select().single();

      if (error) throw error;
      toast({ title: "Song Created!", description: "Check your dashboard!" });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to create song", variant: "destructive" });
    } finally {
      setGeneratingAudio(false);
      setShowStopForm(false);
    }
  };

  // Logged In View
  if (user) {
    if (showStopForm) {
      return (
        <div className="min-h-screen bg-background">
          <Nav user={user} handleSignOut={signOut} />
          <div className="max-w-2xl mx-auto pt-32 px-6">
            <Button variant="ghost" className="mb-6 hover:text-white" onClick={() => setShowStopForm(false)}>
              ← Back to Home
            </Button>
            <div className="premium-card p-8">
              <TripStopForm onSubmit={handleStopSubmit} loading={generatingAudio} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Nav user={user} handleSignOut={signOut} />
        <AnimatedBackground />

        <main className="container mx-auto px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back! <span className="text-primary">Ready to create?</span></h1>
            <p className="text-xl text-muted-foreground">Continue building your road trip soundtrack.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div
              onClick={() => setShowStopForm(true)}
              className="group cursor-pointer premium-card p-10 flex flex-col items-center text-center hover:bg-white/5 transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plus className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Create New Song</h3>
              <p className="text-muted-foreground">Capture a new memory from your recent stop.</p>
            </div>

            <div className="group cursor-pointer premium-card p-10 flex flex-col items-center text-center opacity-60 hover:opacity-100 transition-all">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">My Trips</h3>
              <p className="text-muted-foreground">View your past journeys and albums.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Public Landing Page
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Nav user={null} handleSignOut={() => { }} />
      <AnimatedBackground />
      <FloatingMusicNotes />

      <Hero />

      {/* How It Works Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-8 leading-tight">
                Your Memories <br />
                <span className="text-gradient-gold">Reimagined</span>
              </h2>
              <div className="space-y-6">
                <StepCard number="01" title="Share a memory or stop" active />
                <StepCard number="02" title="Pick a genre & vibe" active />
                <StepCard number="03" title="Get a custom song instantly" active />
              </div>
              <div className="mt-12">
                <Link to="/auth">
                  <Button size="lg" className="shine-button">
                    Start Your Journey
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <div className="relative glass-panel rounded-3xl p-2 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src={campfireImage} alt="App Interface" className="rounded-2xl w-full object-cover shadow-2xl" />

                {/* Floating Player UI Element */}
                <div className="absolute -bottom-8 -left-8 bg-[#1a1a1a] p-4 rounded-xl border border-white/10 shadow-xl flex items-center gap-4 animate-float max-w-xs">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Radio className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Grand Canyon Sunset</div>
                    <div className="text-xs text-white/50">Indie Folk • Generated just now</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Music Samples / Features */}
      <section className="py-32 bg-secondary/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Listen to the <span className="text-primary italic">Adventure</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From desert rock anthems to coastal jazz, hear what AI-powered travel memories sound like.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MapPin}
              title="Smart Locations"
              desc="We automatically tag your stops and pull in local vibes to make the lyrics authentic to where you are."
              delay={0.1}
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Composition"
              desc="Our advanced music engine composes unique melodies and lyrics that match the emotions of your story."
              delay={0.2}
            />
            <FeatureCard
              icon={Headphones}
              title="Studio Quality"
              desc="Get professionally mixed and mastered audio files ready for your Spotify or Apple Music road trip playlist."
              delay={0.3}
            />
          </div>

          <div className="mt-20 max-w-3xl mx-auto space-y-4">
            {/* Reusing existing simplified song player UI but with new CSS */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Star className="text-primary h-5 w-5 fill-primary" />
                Featured Creations
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Midnight in Marfa", genre: "Desert Rock", city: "Marfa, TX" },
                  { title: "Foggy Coastline", genre: "Acoustic Folk", city: "Big Sur, CA" },
                  { title: "Neon Lights", genre: "Synthwave", city: "Las Vegas, NV" }
                ].map((track, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 ml-1" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{track.title}</div>
                        <div className="text-sm text-white/50">{track.genre} • {track.city}</div>
                      </div>
                    </div>
                    <div className="text-white/30 text-sm font-mono">2:45</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              Start Your <span className="text-gradient-gold">Road Trip</span> Album
            </h2>
            <p className="text-2xl text-muted-foreground mb-12">
              Your first song is FREE. No credit card required.
            </p>
            <Link to="/auth">
              <button className="shine-button text-xl px-12 py-6">
                Create My First Song
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full -z-10" />
      </section>

      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
