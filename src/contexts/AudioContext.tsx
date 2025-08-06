
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song } from '@/types';

interface AudioQueue {
  songs: Song[];
  currentIndex: number;
  history: number[];
  shuffledIndices?: number[];
}

interface AudioContextType {
  // Queue management
  queue: AudioQueue;
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  
  // Playback controls
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  crossfadeDuration: number;
  
  // Audio methods
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  setCrossfadeDuration: (duration: number) => void;
  
  // Current song info
  currentSong: Song | null;
  
  // Favorites
  favorites: Set<string>;
  toggleFavorite: (songId: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueueState] = useState<AudioQueue>({
    songs: [],
    currentIndex: -1,
    history: []
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatModeState] = useState<'none' | 'one' | 'all'>('none');
  const [crossfadeDuration, setCrossfadeDurationState] = useState(3);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const audioRef = useRef<HTMLAudioElement>(null);
  const nextAudioRef = useRef<HTMLAudioElement>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout>();

  const currentSong = queue.songs[queue.currentIndex] || null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const setQueue = (songs: Song[], startIndex = 0) => {
    const shuffledIndices = isShuffle 
      ? songs.map((_, i) => i).sort(() => Math.random() - 0.5)
      : undefined;
    
    setQueueState({
      songs,
      currentIndex: startIndex,
      history: [],
      shuffledIndices
    });
  };

  const addToQueue = (song: Song) => {
    setQueueState(prev => ({
      ...prev,
      songs: [...prev.songs, song]
    }));
  };

  const removeFromQueue = (index: number) => {
    setQueueState(prev => ({
      ...prev,
      songs: prev.songs.filter((_, i) => i !== index),
      currentIndex: prev.currentIndex > index ? prev.currentIndex - 1 : prev.currentIndex
    }));
  };

  const clearQueue = () => {
    setQueueState({
      songs: [],
      currentIndex: -1,
      history: []
    });
    setIsPlaying(false);
  };

  const play = async () => {
    if (audioRef.current && currentSong?.audio_url) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const getNextIndex = () => {
    if (queue.songs.length === 0) return -1;
    
    if (isShuffle && queue.shuffledIndices) {
      const currentShuffledPosition = queue.shuffledIndices.indexOf(queue.currentIndex);
      const nextShuffledPosition = (currentShuffledPosition + 1) % queue.shuffledIndices.length;
      return queue.shuffledIndices[nextShuffledPosition];
    }
    
    return (queue.currentIndex + 1) % queue.songs.length;
  };

  const getPreviousIndex = () => {
    if (queue.history.length > 0) {
      return queue.history[queue.history.length - 1];
    }
    
    if (isShuffle && queue.shuffledIndices) {
      const currentShuffledPosition = queue.shuffledIndices.indexOf(queue.currentIndex);
      const prevShuffledPosition = currentShuffledPosition === 0 
        ? queue.shuffledIndices.length - 1 
        : currentShuffledPosition - 1;
      return queue.shuffledIndices[prevShuffledPosition];
    }
    
    return queue.currentIndex === 0 ? queue.songs.length - 1 : queue.currentIndex - 1;
  };

  const next = () => {
    if (repeatMode === 'none' && queue.currentIndex === queue.songs.length - 1) {
      pause();
      return;
    }

    const nextIndex = getNextIndex();
    if (nextIndex !== -1) {
      setQueueState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        history: [...prev.history.slice(-10), prev.currentIndex] // Keep last 10 in history
      }));
    }
  };

  const previous = () => {
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const prevIndex = getPreviousIndex();
    if (prevIndex !== -1) {
      setQueueState(prev => ({
        ...prev,
        currentIndex: prevIndex,
        history: prev.history.slice(0, -1)
      }));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    const newShuffle = !isShuffle;
    setIsShuffle(newShuffle);
    
    if (newShuffle) {
      const shuffledIndices = queue.songs.map((_, i) => i).sort(() => Math.random() - 0.5);
      setQueueState(prev => ({ ...prev, shuffledIndices }));
    } else {
      setQueueState(prev => ({ ...prev, shuffledIndices: undefined }));
    }
  };

  const toggleFavorite = (songId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(songId)) {
        newFavorites.delete(songId);
      } else {
        newFavorites.add(songId);
      }
      return newFavorites;
    });
  };

  return (
    <AudioContext.Provider
      value={{
        queue,
        setQueue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        crossfadeDuration,
        play,
        pause,
        next,
        previous,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        setRepeatMode: setRepeatModeState,
        setCrossfadeDuration: setCrossfadeDurationState,
        currentSong,
        favorites,
        toggleFavorite
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.audio_url || undefined}
        preload="metadata"
      />
      <audio
        ref={nextAudioRef}
        preload="metadata"
      />
    </AudioContext.Provider>
  );
};
