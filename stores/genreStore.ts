import { create } from 'zustand';
import * as genreService from '../services/genreService';
import type { Genre } from '../types/database';

interface GenreStore {
  genres: Genre[];
  selectedGenreId: string | null;
  isLoading: boolean;
  fetchGenres: () => Promise<void>;
  selectGenre: (id: string | null) => void;
}

export const useGenreStore = create<GenreStore>((set) => ({
  genres: [],
  selectedGenreId: null,
  isLoading: false,

  fetchGenres: async () => {
    set({ isLoading: true });
    try {
      const genres = await genreService.fetchGenres();
      set({ genres, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  selectGenre: (id) => set({ selectedGenreId: id }),
}));
