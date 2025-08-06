import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Heart, Music, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputField } from '@/components/ui/input-field';
import { TextareaField } from '@/components/ui/textarea-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTrips } from '@/hooks/useTrips';
import { useSongs } from '@/hooks/useSongs';
import { useCredits } from '@/hooks/useCredits';
import { toast } from '@/hooks/use-toast';
import { GENRES, DURATIONS } from '@/types';

interface StopStoryFormProps {
  onComplete?: (tripId: string) => void;
  existingTripId?: string;
}

export const StopStoryForm = ({ onComplete, existingTripId }: StopStoryFormProps) => {
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const { generateSong } = useSongs();
  const { balance, consumeCredits } = useCredits();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    stopName: '',
    tripTitle: '',
    whoWasThere: '',
    whatHappened: '',
    genre: '',
    duration: 30,
    mood: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const moods = [
    { value: 'upbeat', label: 'Upbeat & Energetic', emoji: '🎉' },
    { value: 'chill', label: 'Chill & Relaxed', emoji: '😌' },
    { value: 'nostalgic', label: 'Nostalgic & Emotional', emoji: '💭' },
    { value: 'adventurous', label: 'Adventurous & Bold', emoji: '🚀' },
    { value: 'romantic', label: 'Romantic & Sweet', emoji: '💕' },
    { value: 'funny', label: 'Funny & Lighthearted', emoji: '😄' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.stopName.trim()) {
      newErrors.stopName = 'Stop name is required';
    }
    
    if (!existingTripId && !formData.tripTitle.trim()) {
      newErrors.tripTitle = 'Trip title is required for your first stop';
    }
    
    if (!formData.whatHappened.trim()) {
      newErrors.whatHappened = 'Tell us what happened - this makes your song unique!';
    }
    
    if (!formData.genre) {
      newErrors.genre = 'Pick a genre for your song';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePrompt = () => {
    const { stopName, whoWasThere, whatHappened, mood, genre } = formData;
    
    let prompt = `Create a ${genre.toLowerCase()} song about our stop in ${stopName}. `;
    
    if (whoWasThere.trim()) {
      prompt += `The people there were: ${whoWasThere}. `;
    }
    
    prompt += `Here's what happened: ${whatHappened}. `;
    
    if (mood) {
      const moodLabel = moods.find(m => m.value === mood)?.label || mood;
      prompt += `Make it ${moodLabel.toLowerCase()}. `;
    }
    
    prompt += `Capture the memory and feeling of this moment in the song.`;
    
    return prompt;
  };

  const handleGenerateSong = async () => {
    if (!validateForm()) return;
    
    if (!balance || balance.available_credits < 1) {
      toast({
        title: "Not Enough Credits",
        description: "You need at least 1 credit to generate a song. Purchase more credits in settings.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Create trip if this is the first stop
      let tripId = existingTripId;
      if (!tripId) {
        const newTrip = await createTrip({
          title: formData.tripTitle,
          description: `Road trip album - started in ${formData.stopName}`,
          stops: [{
            name: formData.stopName,
            description: formData.whatHappened,
            people: formData.whoWasThere
          }]
        });
        tripId = newTrip.id;
      }

      // Generate the song
      const songData = {
        title: `${formData.stopName} Memories`,
        stop_name: formData.stopName,
        genre: formData.genre,
        prompt: generatePrompt(),
        duration: formData.duration,
        people: formData.whoWasThere,
        stories: formData.whatHappened,
        trip_id: tripId
      };

      await generateSong(songData);
      
      // Consume credits
      await consumeCredits(1, `Song generated for ${formData.stopName}`);

      toast({
        title: "Song Generated! 🎵",
        description: `Your ${formData.genre} song about ${formData.stopName} is ready!`,
      });

      if (onComplete && tripId) {
        onComplete(tripId);
      } else {
        navigate(`/trip/${tripId}`);
      }

    } catch (error) {
      console.error('Error generating song:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your song. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const creditsRemaining = balance?.available_credits || 0;
  const canGenerate = creditsRemaining >= 1 && !isGenerating;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {existingTripId ? 'Add Your Next Stop' : 'Capture This Moment'}
          </h1>
          <p className="text-muted-foreground">
            Tell us about what just happened and we'll create a song that captures the memory forever
          </p>
        </div>

        {/* Credits Display */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-card border border-border">
            <div className={`w-2 h-2 rounded-full ${creditsRemaining > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {creditsRemaining} credits remaining
            </span>
          </div>
        </div>

        {/* Main Form */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Where & What Happened
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Stop Name */}
            <InputField
              label="Where were you?"
              placeholder="e.g., Austin, Golden Gate Bridge, Grandma's House"
              value={formData.stopName}
              onChange={(e) => setFormData({ ...formData, stopName: e.target.value })}
              error={errors.stopName}
              required
            />

            {/* Trip Title (only for first stop) */}
            {!existingTripId && (
              <InputField
                label="Trip Title"
                placeholder="e.g., Summer Road Trip 2024, West Coast Adventure"
                value={formData.tripTitle}
                onChange={(e) => setFormData({ ...formData, tripTitle: e.target.value })}
                error={errors.tripTitle}
                required
              />
            )}

            {/* Who Was There */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Who was there? (Optional)
              </label>
              <InputField
                placeholder="e.g., Brad, Sarah, my family, college friends"
                value={formData.whoWasThere}
                onChange={(e) => setFormData({ ...formData, whoWasThere: e.target.value })}
              />
            </div>

            {/* What Happened */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Heart className="h-4 w-4" />
                What happened? Tell the story! *
              </label>
              <TextareaField
                placeholder="e.g., Brad made epic BBQ, Clint fell in the river and we all laughed, we watched the most amazing sunset..."
                value={formData.whatHappened}
                onChange={(e) => setFormData({ ...formData, whatHappened: e.target.value })}
                error={errors.whatHappened}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                The more specific and personal, the better your song will be!
              </p>
            </div>

            {/* Mood Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                What's the vibe?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setFormData({ ...formData, mood: mood.value })}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      formData.mood === mood.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mood.emoji}</span>
                      <span className="text-sm font-medium">{mood.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Genre & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Genre *
                </label>
                <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                  <SelectTrigger className={errors.genre ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pick a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && (
                  <p className="text-sm text-destructive">{errors.genre}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Length
                </label>
                <Select 
                  value={formData.duration.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} seconds
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <Button
                onClick={handleGenerateSong}
                disabled={!canGenerate}
                size="lg"
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                    Creating Your Song...
                  </>
                ) : (
                  <>
                    <Music className="h-5 w-5" />
                    Generate Song (1 Credit)
                  </>
                )}
              </Button>
              
              {creditsRemaining === 0 && (
                <p className="text-sm text-center text-muted-foreground mt-2">
                  <button 
                    onClick={() => navigate('/settings')}
                    className="text-primary hover:underline"
                  >
                    Purchase credits
                  </button> to generate songs
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-accent/30 border-border">
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-2">💡 Pro Tips for Better Songs:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be specific: "Brad's legendary BBQ" vs "we had food"</li>
              <li>• Include emotions: "we couldn't stop laughing when..."</li>
              <li>• Mention unique details: weird things you saw, inside jokes</li>
              <li>• Names make it personal: real people create better stories</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};