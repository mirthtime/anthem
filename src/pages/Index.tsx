import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSongs } from '@/hooks/useSongs';
import { useTrips } from '@/hooks/useTrips';
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { TripStopForm } from '@/components/TripStopForm';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Music, MapPin, LogOut, Plus, Play, ArrowRight, Disc3, Headphones, Quote, Users, Mic2, Sparkles, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-road-trip.jpg';
import { SongGenerationLoader } from '@/components/SongGenerationLoader';

// Cinematic Nav
const Nav = ({ user, handleSignOut }: { user: any, handleSignOut: () => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/90 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Disc3 className="h-8 w-8 text-primary transition-transform duration-500 group-hover:rotate-180" />
          </div>
          <span className="text-2xl font-bold tracking-wider">ANTHEM</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-white/60 hover:text-white">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <button className="ghost-button">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Hero Section - Cinematic opener with video background
const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroImage}
          className="w-full h-[120%] object-cover opacity-60"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </video>
      </motion.div>

      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent z-10" />

      <motion.div style={{ opacity }} className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand Mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <Disc3 className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-slow" />
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-7xl md:text-9xl font-bold tracking-wider mb-6 text-shadow-cinematic">
            ANTHEM
          </h1>

          <p className="text-xl md:text-2xl text-white/60 mb-4 tracking-wide font-light">
            Every memory deserves one.
          </p>

          <div className="cinematic-divider" />

          <p className="text-lg text-white/50 max-w-xl mx-auto mb-12" style={{ fontFamily: 'DM Sans' }}>
            Turn your moments into hyper-personalized songs you'll actually listen to again.
            The inside jokes. The people. The places. Locked in forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <button className="anthem-button text-lg group">
                <span className="flex items-center gap-2">
                  Create Your First Anthem
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ fontFamily: 'DM Sans' }}>The Story</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

// Origin Story Section - The heart of Anthem
const OriginStory = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const paragraphs = [
    {
      text: "It started with a road trip.",
      highlight: false,
      delay: 0
    },
    {
      text: "Three friends. Austin, Texas. Tesla's new robotaxis had just launched, and we had to see it for ourselves.",
      highlight: false,
      delay: 0.2
    },
    {
      text: "Then down to Starbase in Boca Chica to watch rockets being built. A once-in-a-lifetime trip.",
      highlight: false,
      delay: 0.4
    },
    {
      text: "Every night, we'd recap the day. The weird stuff. The funny stuff. The moments that made us laugh until we couldn't breathe.",
      highlight: false,
      delay: 0.6
    },
    {
      text: "And then we figured out how to bottle it.",
      highlight: true,
      delay: 0.8
    },
    {
      text: "We turned those stories into songs. Using AI. Our names in the lyrics. Our inside jokes in the verses. The exact details of what happened.",
      highlight: false,
      delay: 1.0
    },
    {
      text: "Months later, we still listen to them.",
      highlight: true,
      delay: 1.2
    },
    {
      text: "Not because they're perfect. Because they're ours. They bring back exactly how we felt. Every time.",
      highlight: false,
      delay: 1.4
    }
  ];

  return (
    <section className="py-32 md:py-48 relative" ref={containerRef}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <Quote className="h-12 w-12 text-primary/30 mb-8" />
        </motion.div>

        <div className="space-y-8">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: para.delay, duration: 0.8 }}
              className={`story-text ${para.highlight ? 'text-primary text-2xl md:text-3xl font-medium' : ''}`}
            >
              {para.text}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-16"
        >
          <div className="cinematic-divider" />
          <p className="text-center text-white/40 text-sm uppercase tracking-[0.2em]" style={{ fontFamily: 'DM Sans' }}>
            That's why we built Anthem
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// What Makes It Different
const WhatMakesItDifferent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      title: "Hyper-Specific",
      description: "Not generic travel music. Songs with your names, your inside jokes, the exact details of what happened."
    },
    {
      title: "Actually Revisitable",
      description: "Songs you'll play months later because they instantly transport you back to that moment."
    },
    {
      title: "Charmingly Imperfect",
      description: "The AI quirks become part of the memory. That weird lyric? Now it's an inside joke too."
    }
  ];

  return (
    <section className="py-32 bg-secondary/30 relative overflow-hidden" ref={ref}>
      {/* Warm glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[150px] rounded-full" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-wider mb-6">
            NOT JUST <span className="text-gradient-gold">MUSIC</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto" style={{ fontFamily: 'DM Sans' }}>
            Emotional time capsules you can listen to.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.8 }}
              className="premium-card p-8 text-center"
            >
              <h3 className="text-2xl font-bold tracking-wide mb-4" style={{ fontFamily: 'Bebas Neue' }}>
                {feature.title}
              </h3>
              <p className="text-white/60" style={{ fontFamily: 'DM Sans' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Use Cases Section
const UseCases = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cases = [
    { emoji: "🚗", title: "Road Trips", desc: "Every stop, every detour, every roadside memory" },
    { emoji: "🎉", title: "Celebrations", desc: "Bachelor parties, reunions, milestone birthdays" },
    { emoji: "✈️", title: "Adventures", desc: "That trip you'll never forget (and now never will)" },
    { emoji: "👨‍👩‍👧‍👦", title: "Family Trips", desc: "Annual traditions, vacations, moments with the people who matter" },
  ];

  return (
    <section className="py-32 relative" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-wider mb-6">
            FOR <span className="text-gradient-gold">ANY MOMENT</span>
          </h2>
          <p className="text-xl text-white/50" style={{ fontFamily: 'DM Sans' }}>
            If it's worth remembering, it's worth an anthem.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
              className="glass-panel rounded-xl p-6 text-center hover:bg-white/5 transition-colors group cursor-default"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{c.emoji}</div>
              <h3 className="text-xl font-bold tracking-wide mb-2">{c.title}</h3>
              <p className="text-sm text-white/50" style={{ fontFamily: 'DM Sans' }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// The Game Section - Showcasing Round-Robin Collaborative Experience
const TheGame = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const travelers = [
    { name: "Sarah", avatar: "🧑‍✈️", color: "#E67E22", isToday: true },
    { name: "Mike", avatar: "🎸", color: "#3498DB", isToday: false },
    { name: "Jess", avatar: "🦊", color: "#9B59B6", isToday: false },
    { name: "Alex", avatar: "🌟", color: "#1ABC9C", isToday: false },
  ];

  const gameSteps = [
    { icon: "📝", title: "Capture", desc: "Today's storyteller logs moments throughout the day" },
    { icon: "🎵", title: "Create", desc: "At day's end, generate your anthem from the memories" },
    { icon: "🔄", title: "Pass It On", desc: "Tomorrow, someone else takes the mic" },
  ];

  return (
    <section className="py-32 relative overflow-hidden" ref={ref}>
      {/* Decorative Background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Road Trips Are Better Together</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold tracking-wider mb-6">
            IT'S A <span className="text-gradient-gold">GAME</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto" style={{ fontFamily: 'DM Sans' }}>
            Take turns being the day's storyteller. Capture moments. Create anthems.
            Build your trip's soundtrack together.
          </p>
        </motion.div>

        {/* Travelers Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex justify-center items-center gap-4 md:gap-8 mb-16 flex-wrap"
        >
          {travelers.map((traveler, i) => (
            <motion.div
              key={traveler.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className={`relative flex flex-col items-center ${traveler.isToday ? 'scale-110' : ''}`}
            >
              {/* Today Badge */}
              {traveler.isToday && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: traveler.color + '30', color: traveler.color }}
                >
                  <Mic2 className="h-3 w-3" />
                  TODAY
                </motion.div>
              )}

              {/* Avatar */}
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl transition-all ${
                  traveler.isToday
                    ? 'ring-4 shadow-lg'
                    : 'opacity-60'
                }`}
                style={{
                  backgroundColor: traveler.color + '30',
                  ringColor: traveler.isToday ? traveler.color : 'transparent'
                }}
              >
                {traveler.avatar}
              </div>

              {/* Name */}
              <span className={`mt-2 text-sm font-medium ${traveler.isToday ? 'text-white' : 'text-white/50'}`}>
                {traveler.name}
              </span>

              {/* Connector Arrow */}
              {i < travelers.length - 1 && (
                <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-white/20">
                  →
                </div>
              )}
            </motion.div>
          ))}

          {/* Loop Back Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            className="hidden md:flex items-center gap-2 text-white/30 ml-4"
          >
            <RotateCcw className="h-5 w-5" />
            <span className="text-sm">Repeat</span>
          </motion.div>
        </motion.div>

        {/* Game Flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {gameSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
              className="premium-card p-6 text-center relative group"
            >
              {/* Step Number */}
              <div className="absolute top-3 right-3 text-xs font-bold text-primary/30">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold tracking-wide mb-2">{step.title}</h3>
              <p className="text-sm text-white/60" style={{ fontFamily: 'DM Sans' }}>
                {step.desc}
              </p>

              {/* Connector */}
              {i < gameSteps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-white/40 italic" style={{ fontFamily: 'DM Sans' }}>
            "By the end of the trip, you'll have a complete album — written by everyone."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// How It Works
const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { num: "01", title: "Add Your Crew", desc: "Invite friends and family to your trip. Everyone gets a turn." },
    { num: "02", title: "Capture Moments", desc: "The day's storyteller logs highlights, funny moments, and memories." },
    { num: "03", title: "Generate Your Anthem", desc: "Turn the day's story into a hyper-personalized song." },
    { num: "04", title: "Pass the Mic", desc: "Tomorrow, someone else takes over. Repeat until journey's end." },
  ];

  return (
    <section className="py-32 bg-secondary/30 relative" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-wider mb-6">
            HOW IT <span className="text-gradient-gold">WORKS</span>
          </h2>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.8 }}
              className="flex items-start gap-8"
            >
              <div className="text-6xl md:text-7xl font-bold text-primary/20" style={{ fontFamily: 'Bebas Neue' }}>
                {step.num}
              </div>
              <div className="pt-2">
                <h3 className="text-2xl md:text-3xl font-bold tracking-wide mb-2">{step.title}</h3>
                <p className="text-lg text-white/60" style={{ fontFamily: 'DM Sans' }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA
const FinalCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 md:py-48 relative overflow-hidden" ref={ref}>
      {/* Warm glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[200px] rounded-full" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-6xl md:text-8xl font-bold tracking-wider mb-8">
            YOUR FIRST <span className="text-gradient-gold">ANTHEM</span>
            <br />IS FREE
          </h2>

          <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto" style={{ fontFamily: 'DM Sans' }}>
            No credit card. No catch. Just a song that's actually about your life.
          </p>

          <Link to="/auth">
            <button className="anthem-button text-xl px-12 py-5 group">
              <span className="flex items-center gap-3">
                Start Creating
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="py-12 border-t border-white/5">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <Disc3 className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold tracking-wider">ANTHEM</span>
      </div>
      <p className="text-sm text-white/40" style={{ fontFamily: 'DM Sans' }}>
        Every memory deserves one.
      </p>
    </div>
  </footer>
);

// Main Index Component
const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { generateSong } = useSongs();
  const { createTrip } = useTrips();
  const { balance, consumeCredits } = useCredits();
  const [showStopForm, setShowStopForm] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [generatingData, setGeneratingData] = useState<{ stopName: string; genre: string } | null>(null);

  const handleStopSubmit = async (data: {
    stopName: string;
    people: string;
    stories: string;
    genre: string;
    customStyle?: string;
  }) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!balance || balance.available_credits < 1) {
      toast({
        title: "Not Enough Credits",
        description: "You need at least 1 credit to generate a song. Get more in settings.",
        variant: "destructive"
      });
      return;
    }

    setGeneratingAudio(true);
    setGeneratingData({ stopName: data.stopName, genre: data.genre });

    try {
      const autoTripTitle = `${data.stopName} Adventures`;
      const newTrip = await createTrip({
        title: autoTripTitle,
        description: `Memory album - started in ${data.stopName}`,
        stops: [{
          name: data.stopName,
          description: data.stories,
          people: data.people
        }]
      });

      await generateSong({
        title: `${data.stopName} Anthem`,
        stop_name: data.stopName,
        people: data.people || '',
        stories: data.stories || '',
        genre: data.genre,
        custom_style: data.customStyle,
        prompt: `A ${data.genre} song about ${data.stories} at ${data.stopName}${data.people ? ` with ${data.people}` : ''}`,
        trip_id: newTrip.id,
        user_id: user.id
      });

      await consumeCredits(1, `Anthem created for ${data.stopName}`);

      toast({ title: "Your Anthem is Being Created!", description: "Check your album in a moment." });
      navigate(`/trip/${newTrip.id}`);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to create anthem. Please try again.", variant: "destructive" });
    } finally {
      setGeneratingAudio(false);
      setGeneratingData(null);
      setShowStopForm(false);
    }
  };

  // Logged In: Create Form View
  if (user && showStopForm) {
    return (
      <div className="min-h-screen bg-background">
        <Nav user={user} handleSignOut={signOut} />
        <SongGenerationLoader
          isVisible={generatingAudio}
          songName={generatingData?.stopName}
          genre={generatingData?.genre}
        />
        <div className="max-w-2xl mx-auto pt-32 px-6">
          <Button variant="ghost" className="mb-6 hover:text-white" onClick={() => setShowStopForm(false)}>
            ← Back
          </Button>
          <div className="premium-card p-8">
            <h2 className="text-3xl font-bold tracking-wider mb-6">CREATE YOUR ANTHEM</h2>
            <TripStopForm onSubmit={handleStopSubmit} loading={generatingAudio} />
          </div>
        </div>
      </div>
    );
  }

  // Logged In: Dashboard-ish Home
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Nav user={user} handleSignOut={signOut} />

        <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-wider mb-4">
              WELCOME BACK
            </h1>
            <p className="text-xl text-white/50" style={{ fontFamily: 'DM Sans' }}>
              Ready to lock in another memory?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setShowStopForm(true)}
              className="premium-card p-10 flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/30 transition-all">
                <Plus className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold tracking-wide mb-2">Create New Anthem</h3>
              <p className="text-white/50" style={{ fontFamily: 'DM Sans' }}>
                Capture a new memory in song
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/dashboard" className="block h-full">
                <div className="premium-card p-10 flex flex-col items-center text-center h-full group">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                    <Headphones className="h-10 w-10 text-white/70" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-wide mb-2">My Anthems</h3>
                  <p className="text-white/50" style={{ fontFamily: 'DM Sans' }}>
                    Listen to your memory collection
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Public Landing Page
  return (
    <div className="min-h-screen bg-background">
      <Nav user={null} handleSignOut={() => {}} />

      <Hero />
      <OriginStory />
      <WhatMakesItDifferent />
      <UseCases />
      <TheGame />
      <HowItWorks />
      <FinalCTA />
      <Footer />

      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
