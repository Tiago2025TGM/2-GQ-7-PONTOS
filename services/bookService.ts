import { supabase } from './supabase';
import type { Book, ReadingProgress } from '../types/database';

export interface CreateBookInput {
  title: string;
  author: string;
  cover_url?: string | null;
  description?: string | null;
  total_pages?: number | null;
  year_published?: number | null;
  is_public?: boolean;
  genreIds?: string[];
  progress?: {
    status: ReadingProgress['status'];
    current_page?: number | null;
    rating?: number | null;
    notes?: string | null;
  };
}

export type UpdateBookInput = Partial<CreateBookInput>;

export async function fetchBooks(options?: { genreId?: string; search?: string; userId?: string }): Promise<Book[]> {
  let query = supabase
    .from('books')
    .select(`
      *,
      profiles(id, username, avatar_url),
      genres:book_genres(genres(*)),
      reading_progress(*)
    `)
    .order('created_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  } else {
    query = query.eq('is_public', true);
  }

  if (options?.genreId) {
    const { data: bgData } = await supabase
      .from('book_genres')
      .select('book_id')
      .eq('genre_id', options.genreId);
    const bookIds = bgData?.map((r: any) => r.book_id) ?? [];
    if (bookIds.length === 0) return [];
    query = query.in('id', bookIds);
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,author.ilike.%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(normalizeBook);
}

export async function fetchBookById(id: string): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      profiles(id, username, avatar_url),
      genres:book_genres(genres(*)),
      reading_progress(*)
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  return normalizeBook(data);
}

export async function createBook(userId: string, input: CreateBookInput): Promise<Book> {
  const { genreIds, progress, ...bookData } = input;

  const { data: book, error } = await supabase
    .from('books')
    .insert({ ...bookData, user_id: userId })
    .select()
    .single();
  if (error) throw error;

  if (genreIds?.length) {
    await supabase.from('book_genres').insert(
      genreIds.map((genre_id) => ({ book_id: book.id, genre_id }))
    );
  }

  if (progress) {
    await supabase.from('reading_progress').insert({
      book_id: book.id,
      user_id: userId,
      ...progress,
    });
  }

  return fetchBookById(book.id);
}

export async function updateBook(id: string, userId: string, input: UpdateBookInput): Promise<Book> {
  const { genreIds, progress, ...bookData } = input;

  if (Object.keys(bookData).length > 0) {
    const { error } = await supabase
      .from('books')
      .update({ ...bookData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  }

  if (genreIds !== undefined) {
    await supabase.from('book_genres').delete().eq('book_id', id);
    if (genreIds.length > 0) {
      await supabase.from('book_genres').insert(
        genreIds.map((genre_id) => ({ book_id: id, genre_id }))
      );
    }
  }

  if (progress !== undefined) {
    await supabase
      .from('reading_progress')
      .upsert({ book_id: id, user_id: userId, ...progress }, { onConflict: 'book_id,user_id' });
  }

  return fetchBookById(id);
}

export async function deleteBook(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

// Supabase returns genres as [{genres: {...}}] from the join — flatten it
function normalizeBook(raw: any): Book {
  return {
    ...raw,
    genres: raw.genres?.map((g: any) => g.genres).filter(Boolean) ?? [],
  };
}
