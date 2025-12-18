import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic2,
  Calendar,
  Users,
  ChevronRight,
  Sparkles,
  Music,
  Clock,
  MapPin,
  Plus,
  Check,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ActiveTrip, Traveler, TripDay } from '@/types';
import { StorytellerSpotlight } from './StorytellerSpotlight';
import { TripTimeline } from './TripTimeline';
import { QuickNoteInput } from './QuickNoteInput';

interface ActiveTripDashboardProps {
  trip: ActiveTrip;
  onAddNote: (content: string) => void;
  onFinishDay: () => void;
  onPlaySong: (songId: string) => void;
}

export const ActiveTripDashboard = ({
  trip,
  onAddNote,
  onFinishDay,
  onPlaySong
}: ActiveTripDashboardProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);

  const today = trip.days.find(d => d.isToday);
  const completedDays = trip.days.filter(d => d.isComplete).length;
  const totalDays = trip.days.length;
  const progressPercent = (completedDays / totalDays) * 100;

  const canFinishDay = today && today.notes.length > 0 && !today.isComplete;

  return (
    <div className="space-y-6">
      {/* Hero: Today's Storyteller */}
      <StorytellerSpotlight
        storyteller={today?.storyteller}
        dayNumber={today?.dayNumber || 1}
        tripTitle={trip.title}
      />

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-4 text-center">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{today?.dayNumber || 1}</div>
            <div className="text-xs text-muted-foreground">Day</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Music className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
            <div className="text-2xl font-bold">{completedDays}</div>
            <div className="text-xs text-muted-foreground">Songs</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{trip.travelers.length}</div>
            <div className="text-xs text-muted-foreground">Travelers</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Album Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="premium-card border-border/30 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Album Progress</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {completedDays}/{totalDays} tracks
              </Badge>
            </div>

            <Progress value={progressPercent} className="h-3 mb-3" />

            <p className="text-sm text-muted-foreground">
              {completedDays === 0
                ? "Your soundtrack is just beginning..."
                : completedDays === totalDays
                ? "🎉 Album complete! Time to listen."
                : `${totalDays - completedDays} more memories to capture`}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Notes Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="premium-card border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: today?.storyteller.color + '20' }}
                >
                  {today?.storyteller.avatar}
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {today?.storyteller.name}'s Notes
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {today?.notes.length || 0} moments captured
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsAddingNote(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 mb-4">
              <AnimatePresence>
                {today?.notes.map((note, i) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(note.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{note.content}</p>
                      {note.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {note.location}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(!today?.notes || today.notes.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Mic2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notes yet today</p>
                  <p className="text-xs">Capture your first moment!</p>
                </div>
              )}
            </div>

            {/* Quick Note Input */}
            <AnimatePresence>
              {isAddingNote && (
                <QuickNoteInput
                  onSubmit={(content) => {
                    onAddNote(content);
                    setIsAddingNote(false);
                  }}
                  onCancel={() => setIsAddingNote(false)}
                  storytellerColor={today?.storyteller.color}
                />
              )}
            </AnimatePresence>

            {/* Finish Day Button */}
            {canFinishDay && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4"
              >
                <Button
                  onClick={onFinishDay}
                  className="w-full shine-button gap-2 py-6"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate Today's Song
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Turn today's memories into music
                </p>
              </motion.div>
            )}

            {today?.isComplete && today.songId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4"
              >
                <Button
                  onClick={() => onPlaySong(today.songId!)}
                  variant="secondary"
                  className="w-full gap-2 py-6"
                  size="lg"
                >
                  <Play className="h-5 w-5" />
                  Play Today's Track
                  <Check className="h-4 w-4 text-emerald-500" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Trip Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <TripTimeline days={trip.days} onPlaySong={onPlaySong} />
      </motion.div>

      {/* Up Next Preview */}
      {trip.roundRobinEnabled && today && today.dayNumber < totalDays && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-muted/30 border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tomorrow:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {trip.days[today.dayNumber]?.storyteller.avatar}
                  </span>
                  <span className="font-medium">
                    {trip.days[today.dayNumber]?.storyteller.name}'s turn
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
