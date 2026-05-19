import { supabase } from './supabase';
import type { Genre } from '../types/database';

export async function fetchGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}
