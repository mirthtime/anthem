
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Song } from '@/types';
import { useSharing } from '@/hooks/useSharing';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { PlayerControls } from '@/components/audio/PlayerControls';
import { ProgressBar } from '@/components/audio/ProgressBar';
import { VolumeControl } from '@/components/audio/VolumeControl';
import { NowPlayingInfo } from '@/components/audio/NowPlayingInfo';

interface AudioPlayerProps {
  songs: Song[];
  currentSongIndex: number;
  onSongChange: (index: number) => void;
  className?: string;
}

export const AudioPlayer = ({ songs, currentSongIndex, onSongChange, className }: AudioPlayerProps) => {
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { downloadAudio } = useSharing();

  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    currentSong
  } = useAudioPlayer(songs, currentSongIndex);

  const nextSong = () => {
    let nextIndex;
    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentSongIndex && songs.length > 1);
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }
    onSongChange(nextIndex);
  };

  const previousSong = () => {
    if (currentTime > 3) {
      // If more than 3 seconds played, restart current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      // Go to previous song
      const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      onSongChange(prevIndex);
    }
  };

  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleDownload = () => {
    if (currentSong?.audio_url) {
      downloadAudio(currentSong.audio_url, `${currentSong.title} - ${currentSong.stop_name}`);
    }
  };

  const toggleFavorite = () => {
    const newFavorites = new Set(favorites);
    if (favorites.has(currentSong.id)) {
      newFavorites.delete(currentSong.id);
    } else {
      newFavorites.add(currentSong.id);
    }
    setFavorites(newFavorites);
  };

  if (!currentSong) return null;

  return (
    <Card className={`bg-gradient-card border-border shadow-card ${className}`}>
      <CardContent className="p-4 md:p-6">
        <audio
          ref={audioRef}
          src={currentSong.audio_url || undefined}
          preload="metadata"
          onEnded={() => {
            if (repeatMode === 'one') {
              togglePlay();
            } else if (repeatMode === 'all' || currentSongIndex < songs.length - 1) {
              nextSong();
            }
          }}
        />

        <div className="space-y-3 md:space-y-4">
          <NowPlayingInfo
            song={currentSong}
            onDownload={handleDownload}
            onToggleFavorite={toggleFavorite}
            isFavorited={favorites.has(currentSong.id)}
          />

          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
          />

          <PlayerControls
            isPlaying={isPlaying}
            isShuffle={isShuffle}
            repeatMode={repeatMode}
            onTogglePlay={togglePlay}
            onPrevious={previousSong}
            onNext={nextSong}
            onToggleShuffle={() => setIsShuffle(!isShuffle)}
            onToggleRepeat={toggleRepeat}
            disabled={!currentSong.audio_url}
          />

          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={changeVolume}
            onToggleMute={toggleMute}
          />
        </div>
      </CardContent>
    </Card>
  );
};
