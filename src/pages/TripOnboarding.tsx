import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  Music,
  Users,
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StopStoryForm } from '@/components/StopStoryForm';

export const TripOnboarding = () => {
  const navigate = useNavigate();
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showPrePlan, setShowPrePlan] = useState(false);

  const handleGetStarted = () => {
    setShowStoryForm(true);
  };

  const handlePrePlan = () => {
    setShowPrePlan(true);
  };

  const handleStoryComplete = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  if (showStoryForm) {
    return <StopStoryForm onComplete={handleStoryComplete} />;
  }

  if (showPrePlan) {
    // Navigate to the old trip wizard for pre-planning
    navigate('/trip/plan');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-primary">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Ready to make your road trip
              <span className="block text-transparent bg-clip-text bg-gradient-primary break-words">
                unforgettable?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create songs for each stop! Turn your real memories into personalized music that captures every moment.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          {[
            {
              icon: MapPin,
              title: "Visit a Stop",
              description: "Explore, experience, make memories"
            },
            {
              icon: Sparkles,
              title: "Capture the Story",
              description: "Tell us what happened, who was there, the vibes"
            },
            {
              icon: Music,
              title: "Get Your Song",
              description: "AI creates a unique song about that exact moment"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center bg-gradient-card border-border shadow-card h-full relative">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 relative">
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-bold flex items-center justify-center shadow-glow">
                      {index + 1}
                    </div>
                    <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-6"
        >
          <Card className="bg-gradient-primary/5 border-primary/20 shadow-button max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Just finished a stop?
                </h2>
                <p className="text-muted-foreground">
                  Perfect! Let's capture that memory while it's fresh and turn it into a song that'll bring you right back to this moment.
                </p>
                
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="gap-2 text-lg px-8 py-6"
                >
                  <Sparkles className="h-6 w-6" />
                  Start Your Trip Album
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Option */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Prefer to plan your whole trip upfront?
            </p>
            <Button 
              variant="outline" 
              onClick={handlePrePlan}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Advanced Planning
            </Button>
          </div>
        </motion.div>

        {/* Example Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-center text-foreground">
            Real stories make the best songs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                stop: "Austin BBQ Joint",
                story: "Brad made the most epic brisket, Clint fell off his chair laughing, and we stayed until closing time sharing stories",
                people: "Brad, Clint, Sarah",
                genre: "Country"
              },
              {
                stop: "Golden Gate Bridge",
                story: "Fog rolled in just as we got there, but Sarah said it was even more magical. We took a million photos and felt so small",
                people: "Sarah, the crew",
                genre: "Indie"
              }
            ].map((example, index) => (
              <Card key={index} className="bg-accent/30 border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{example.stop}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    "{example.story}"
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{example.people}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{example.genre}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};