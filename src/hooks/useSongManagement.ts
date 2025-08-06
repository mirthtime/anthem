
import { useState } from 'react';
import { useSongs } from './useSongs';
import { Song } from '@/types';

export const useSongManagement = (tripId?: string) => {
  const { songs, updateSong, deleteSong, refreshSongs } = useSongs(tripId);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [showReorderModal, setShowReorderModal] = useState(false);

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
  };

  const handleSaveEdit = async (songId: string, updates: Partial<Song>) => {
    await updateSong(songId, updates);
    setEditingSong(null);
  };

  const handleDeleteSong = async (song: Song) => {
    if (!confirm(`Are you sure you want to delete "${song.title}"?`)) return;
    await deleteSong(song.id);
  };

  const handleReorderSongs = async (reorderedSongs: Song[]) => {
    // Update each song with its new position
    const updatePromises = reorderedSongs.map((song, index) => 
      updateSong(song.id, { 
        created_at: new Date(Date.now() + index * 1000).toISOString() 
      })
    );
    
    await Promise.all(updatePromises);
    await refreshSongs();
    setShowReorderModal(false);
  };

  return {
    songs,
    editingSong,
    showReorderModal,
    setEditingSong,
    setShowReorderModal,
    handleEditSong,
    handleSaveEdit,
    handleDeleteSong,
    handleReorderSongs
  };
};
