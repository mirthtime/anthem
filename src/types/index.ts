export interface Trip {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  stops: TripStop[];
  artwork_url?: string;
  artwork_generating?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripStop {
  name: string;
  description?: string;
  stories?: string;
  people?: string;
}

export interface Stop extends TripStop {
  id?: string;
}

export interface Song {
  id: string;
  trip_id: string;
  user_id?: string;
  title: string;
  stop_name: string;
  genre: string;
  prompt: string;
  audio_url?: string;
  lyrics?: string;
  duration: number;
  stories: string;
  people: string;
  artwork_url?: string;
  artwork_generating?: boolean;
  created_at: string;
}

export const GENRES = [
  'Rock',
  'Country', 
  'Pop',
  'Hip-Hop',
  'Electronic',
  'Folk',
  'Jazz',
  'Blues',
  'Indie',
  'Custom'
] as const;

export const STYLE_SUGGESTIONS = [
  // Popular combinations
  'acoustic guitar', 'electric guitar', 'piano ballad', 'upbeat drums',
  // Genres/Subgenres  
  'folk rock', 'country pop', 'indie rock', 'blues rock', 'jazz fusion',
  'synthwave', 'lo-fi hip hop', 'trap beats', 'acoustic folk',
  // Instruments
  'harmonica', 'banjo', 'saxophone', 'violin', 'synthesizer', 'bass guitar',
  // Vibes/Styles
  'nostalgic', 'uplifting', 'melancholic', 'energetic', 'chill vibes',
  'road trip anthem', 'campfire song', 'driving beat', 'sunset mood'
] as const;

export type Genre = typeof GENRES[number];

export const DURATIONS = [30, 60, 90] as const;
export type Duration = typeof DURATIONS[number];

export interface CreditBalance {
  id: string;
  user_id: string;
  available_credits: number;
  total_purchased: number;
  total_used: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'usage';
  description: string;
  stripe_session_id?: string;
  created_at: string;
}