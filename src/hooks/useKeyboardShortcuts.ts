
import { useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

export const useKeyboardShortcuts = () => {
  const {
    isPlaying,
    play,
    pause,
    next,
    previous,
    setVolume,
    volume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    repeatMode
  } = useAudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Prevent default behavior for our shortcuts
      const shortcutKeys = [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 's', 'r', 'm'];
      if (shortcutKeys.includes(e.key) || (e.ctrlKey && ['ArrowUp', 'ArrowDown'].includes(e.key))) {
        e.preventDefault();
      }

      switch (e.key) {
        case ' ':
          // Spacebar - Play/Pause
          if (isPlaying) {
            pause();
          } else {
            play();
          }
          break;
        
        case 'ArrowLeft':
          // Left arrow - Previous track
          previous();
          break;
        
        case 'ArrowRight':
          // Right arrow - Next track
          next();
          break;
        
        case 'ArrowUp':
          // Up arrow - Volume up
          if (e.ctrlKey) {
            setVolume(Math.min(1, volume + 0.1));
          }
          break;
        
        case 'ArrowDown':
          // Down arrow - Volume down
          if (e.ctrlKey) {
            setVolume(Math.max(0, volume - 0.1));
          }
          break;
        
        case 's':
          // S - Toggle shuffle
          toggleShuffle();
          break;
        
        case 'r':
          // R - Cycle repeat mode
          const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
          const currentIndex = modes.indexOf(repeatMode);
          setRepeatMode(modes[(currentIndex + 1) % modes.length]);
          break;
        
        case 'm':
          // M - Toggle mute
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, play, pause, next, previous, setVolume, volume, toggleMute, toggleShuffle, setRepeatMode, repeatMode]);
};
