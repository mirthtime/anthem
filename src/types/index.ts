export interface Trip {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  stops: TripStop[];
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
  created_at: string;
}

export const GENRES = [
  'Rock',
  'Country',
  'Pop',
  'Hip-Hop',
  'Electronic',
  'Custom'
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