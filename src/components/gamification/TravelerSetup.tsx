import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Users,
  Plus,
  X,
  GripVertical,
  Shuffle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Traveler, TRAVELER_COLORS, TRAVELER_AVATARS } from '@/types';

interface TravelerSetupProps {
  travelers: Traveler[];
  onTravelersChange: (travelers: Traveler[]) => void;
  roundRobinEnabled: boolean;
  onRoundRobinChange: (enabled: boolean) => void;
  onContinue: () => void;
  tripDays: number;
}

export const TravelerSetup = ({
  travelers,
  onTravelersChange,
  roundRobinEnabled,
  onRoundRobinChange,
  onContinue,
  tripDays
}: TravelerSetupProps) => {
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(TRAVELER_AVATARS[0]);

  const addTraveler = () => {
    if (!newName.trim()) return;

    const newTraveler: Traveler = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      avatar: selectedAvatar,
      color: TRAVELER_COLORS[travelers.length % TRAVELER_COLORS.length],
      isCurrentUser: travelers.length === 0
    };

    onTravelersChange([...travelers, newTraveler]);
    setNewName('');
    setSelectedAvatar(TRAVELER_AVATARS[(travelers.length + 1) % TRAVELER_AVATARS.length]);
  };

  const removeTraveler = (id: string) => {
    onTravelersChange(travelers.filter(t => t.id !== id));
  };

  const shuffleOrder = () => {
    const shuffled = [...travelers].sort(() => Math.random() - 0.5);
    onTravelersChange(shuffled);
  };

  const getStorytellerAssignments = () => {
    if (!roundRobinEnabled || travelers.length === 0) return [];

    return Array.from({ length: tripDays }, (_, i) => ({
      day: i + 1,
      traveler: travelers[i % travelers.length]
    }));
  };

  const assignments = getStorytellerAssignments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Who's on this trip?</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Add Your <span className="text-primary">Travel Crew</span>
        </h2>
        <p className="text-muted-foreground">
          Each person will take turns telling the day's story
        </p>
      </motion.div>

      {/* Add Traveler Form */}
      <Card className="premium-card border-border/30">
        <CardContent className="p-5">
          {/* Avatar Selection */}
          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-2 block">
              Pick an avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {TRAVELER_AVATARS.slice(0, 16).map((avatar) => (
                <motion.button
                  key={avatar}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                    selectedAvatar === avatar
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {avatar}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
                {selectedAvatar}
              </span>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTraveler()}
                placeholder="Enter name..."
                className="pl-12"
              />
            </div>
            <Button onClick={addTraveler} disabled={!newName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Travelers List */}
      <AnimatePresence>
        {travelers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="premium-card border-border/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Your Crew ({travelers.length})
                  </CardTitle>
                  {travelers.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={shuffleOrder}
                      className="gap-1"
                    >
                      <Shuffle className="h-4 w-4" />
                      Shuffle
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Reorder.Group
                  axis="y"
                  values={travelers}
                  onReorder={onTravelersChange}
                  className="space-y-2"
                >
                  {travelers.map((traveler, index) => (
                    <Reorder.Item
                      key={traveler.id}
                      value={traveler}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 group"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: traveler.color + '30' }}
                        >
                          {traveler.avatar}
                        </div>

                        <div className="flex-1">
                          <div className="font-medium">{traveler.name}</div>
                          {traveler.isCurrentUser && (
                            <div className="text-xs text-primary">You</div>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          #{index + 1}
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTraveler(traveler.id)}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Round Robin Toggle */}
      {travelers.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="premium-card border-border/30">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="round-robin" className="font-medium">
                    Round-Robin Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Each person takes turns being the storyteller
                  </p>
                </div>
                <Switch
                  id="round-robin"
                  checked={roundRobinEnabled}
                  onCheckedChange={onRoundRobinChange}
                />
              </div>

              {/* Preview Assignments */}
              {roundRobinEnabled && assignments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-border/50"
                >
                  <div className="text-sm text-muted-foreground mb-3">
                    Storyteller schedule:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assignments.slice(0, 7).map(({ day, traveler }) => (
                      <div
                        key={day}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: traveler.color + '20' }}
                      >
                        <span>{traveler.avatar}</span>
                        <span>Day {day}</span>
                      </div>
                    ))}
                    {assignments.length > 7 && (
                      <div className="px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                        +{assignments.length - 7} more
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Continue Button */}
      {travelers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={onContinue}
            size="lg"
            className="w-full shine-button gap-2 py-6"
          >
            <Sparkles className="h-5 w-5" />
            Start Your Adventure
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};
