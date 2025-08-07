import { useEffect, useState } from 'react';
import { Music } from 'lucide-react';

interface MusicNote {
  id: number;
  left: number;
  delay: number;
}

export const FloatingMusicNotes = () => {
  const [notes, setNotes] = useState<MusicNote[]>([]);

  useEffect(() => {
    // Create initial notes
    const initialNotes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random position 0-100%
      delay: Math.random() * 8, // Random delay 0-8s
    }));
    setNotes(initialNotes);

    // Regenerate notes periodically
    const interval = setInterval(() => {
      setNotes(prev => prev.map(note => ({
        ...note,
        left: Math.random() * 100,
        delay: Math.random() * 8,
      })));
    }, 12000); // Every 12 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-notes">
      {notes.map((note) => (
        <div
          key={note.id}
          className="music-note"
          style={{
            left: `${note.left}%`,
            animationDelay: `${note.delay}s`,
          }}
        >
          <Music className="h-6 w-6" />
        </div>
      ))}
    </div>
  );
};