export const downloadSong = async (audioUrl: string, fileName: string) => {
  try {
    // Fetch the audio file
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error('Failed to fetch audio file');
    
    // Get the blob
    const blob = await response.blob();
    
    // Create a temporary URL
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.mp3`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('Error downloading song:', error);
    throw error;
  }
};

export const downloadAlbum = async (songs: Array<{ audio_url: string; title: string }>, albumName: string) => {
  // Note: This is a simplified version. In a real app, you might want to:
  // 1. Create a ZIP file containing all songs
  // 2. Add metadata and album artwork
  // 3. Show a progress indicator for multiple downloads
  
  try {
    for (const song of songs) {
      if (song.audio_url) {
        await downloadSong(song.audio_url, `${albumName} - ${song.title}`);
        // Add a small delay between downloads to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    return true;
  } catch (error) {
    console.error('Error downloading album:', error);
    throw error;
  }
};