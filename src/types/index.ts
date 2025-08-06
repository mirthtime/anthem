export interface Trip {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  stops: Stop[];
  created_at: string;
  updated_at: string;
}

export interface Stop {
  id: string;
  name: string;
  stories: string;
  people: string;
  genre: string;
  duration: number;
  order: number;
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