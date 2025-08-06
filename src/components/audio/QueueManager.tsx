
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Music, 
  Play, 
  Trash2, 
  GripVertical, 
  MapPin, 
  Users,
  Heart,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAudio } from '@/contexts/AudioContext';
import { Song } from '@/types';

interface QueueManagerProps {
  className?: string;
}

export const QueueManager = ({ className }: QueueManagerProps) => {
  const { 
    queue, 
    currentSong, 
    removeFromQueue, 
    clearQueue, 
    favorites,
    toggleFavorite,
    setQueue 
  } = useAudio();
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(queue.songs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update queue with new order and adjust current index
    const newCurrentIndex = queue.currentIndex === result.source.index
      ? result.destination.index
      : queue.currentIndex > result.source.index && queue.currentIndex <= result.destination.index
      ? queue.currentIndex - 1
      : queue.currentIndex < result.source.index && queue.currentIndex >= result.destination.index
      ? queue.currentIndex + 1
      : queue.currentIndex;

    setQueue(items, newCurrentIndex);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (queue.songs.length === 0) {
    return (
      <Card className={`bg-gradient-card border-border shadow-card ${className}`}>
        <CardContent className="p-6 text-center">
          <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No songs in queue</h3>
          <p className="text-muted-foreground">Start playing some music to see your queue here.</p>
        </CardContent>
      </Card>
    );
  }

  const upNext = queue.songs.slice(queue.currentIndex + 1);
  const playHistory = queue.history
    .map(index => queue.songs[index])
    .filter(Boolean)
    .reverse()
    .slice(0, 5);

  return (
    <Card className={`bg-gradient-card border-border shadow-card ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Queue ({queue.songs.length} songs)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearQueue}
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-6">
        {/* Now Playing */}
        {currentSong && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Now Playing
            </h4>
            <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full">
                <Play className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{currentSong.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{currentSong.stop_name}</span>
                  {currentSong.people && (
                    <>
                      <span>•</span>
                      <Users className="h-3 w-3" />
                      <span>{currentSong.people}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentSong.genre}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(currentSong.id)}
                  className={favorites.has(currentSong.id) ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(currentSong.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {isExpanded && (
          <>
            {/* Up Next */}
            {upNext.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Up Next ({upNext.length})
                  </h4>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="queue">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {upNext.map((song, index) => {
                          const actualIndex = queue.currentIndex + 1 + index;
                          return (
                            <Draggable key={song.id} draggableId={song.id} index={actualIndex}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                                    snapshot.isDragging
                                      ? 'bg-accent border-primary'
                                      : 'bg-card hover:bg-accent/50 border-border'
                                  }`}
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex items-center justify-center w-6 h-6 text-xs font-medium text-muted-foreground">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm truncate">{song.title}</h5>
                                    <p className="text-xs text-muted-foreground truncate">{song.stop_name}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {song.genre}
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem onClick={() => toggleFavorite(song.id)}>
                                        <Heart className="h-4 w-4 mr-2" />
                                        {favorites.has(song.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => removeFromQueue(actualIndex)}
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove from Queue
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}

            {/* Recently Played */}
            {playHistory.length > 0 && (
              <div className="space-y-3">
                <Separator />
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Recently Played
                </h4>
                <div className="space-y-2">
                  {playHistory.map((song, index) => (
                    <div key={`history-${song.id}-${index}`} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{song.title}</h5>
                        <p className="text-xs text-muted-foreground truncate">{song.stop_name}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {song.genre}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
