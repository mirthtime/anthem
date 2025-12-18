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
  mood?: string;
  custom_style?: string;
  stories: string;
  people: string;
  artwork_url?: string;
  artwork_generating?: boolean;
  status?: 'generating' | 'completed' | 'failed';
  error_message?: string;
  duration?: number;
  author?: Traveler;
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
  'acoustic guitar', 'electric guitar', 'piano ballad', 'upbeat drums',
  'folk rock', 'country pop', 'indie rock', 'blues rock', 'jazz fusion',
  'synthwave', 'lo-fi hip hop', 'trap beats', 'acoustic folk',
  'harmonica', 'banjo', 'saxophone', 'violin', 'synthesizer', 'bass guitar',
  'nostalgic', 'uplifting', 'melancholic', 'energetic', 'chill vibes',
  'road trip anthem', 'campfire song', 'driving beat', 'sunset mood'
] as const;

export type Genre = typeof GENRES[number];

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

// ============================================
// GAMIFICATION & ROUND-ROBIN TYPES
// ============================================

export interface Traveler {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isCurrentUser?: boolean;
}

export interface TripDay {
  date: string;
  dayNumber: number;
  storyteller: Traveler;
  notes: DayNote[];
  songId?: string;
  isComplete: boolean;
  isToday: boolean;
}

export interface DayNote {
  id: string;
  content: string;
  timestamp: string;
  location?: string;
  mood?: 'excited' | 'chill' | 'adventurous' | 'reflective' | 'funny';
}

export interface ActiveTrip extends Trip {
  travelers: Traveler[];
  days: TripDay[];
  currentDayIndex: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  roundRobinEnabled: boolean;
}

export const TRAVELER_COLORS = [
  '#E67E22', // Amber
  '#3498DB', // Blue
  '#9B59B6', // Purple
  '#1ABC9C', // Teal
  '#E74C3C', // Coral
  '#2ECC71', // Emerald
  '#F39C12', // Gold
  '#E91E63', // Pink
] as const;

export const TRAVELER_AVATARS = [
  '🧑‍✈️', '👨‍🎤', '👩‍🎨', '🧑‍🚀', '👨‍💻', '👩‍🔬', '🧑‍🍳', '👨‍🌾',
  '🦊', '🐻', '🦁', '🐯', '🐨', '🐼', '🦄', '🐸',
  '🌟', '🔥', '⚡', '🌊', '🎸', '🎺', '🥁', '🎹'
] as const;

export type TravelerColor = typeof TRAVELER_COLORS[number];
export type TravelerAvatar = typeof TRAVELER_AVATARS[number];
