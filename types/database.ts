export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Genre {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  cover_url: string | null;
  description: string | null;
  total_pages: number | null;
  year_published: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  genres?: Genre[];
  reading_progress?: ReadingProgress[];
  profiles?: Profile;
}

export interface ReadingProgress {
  id: string;
  book_id: string;
  user_id: string;
  status: 'want_to_read' | 'reading' | 'finished';
  current_page: number | null;
  rating: number | null;
  notes: string | null;
  started_at: string | null;
  finished_at: string | null;
}

export interface BookGenre {
  book_id: string;
  genre_id: string;
}

export type ReadingStatus = ReadingProgress['status'];
