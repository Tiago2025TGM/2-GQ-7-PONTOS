import { create } from 'zustand';
import * as bookService from '../services/bookService';
import type { Book } from '../types/database';
import type { CreateBookInput, UpdateBookInput } from '../services/bookService';

interface BookStore {
  books: Book[];
  myBooks: Book[];
  selectedBook: Book | null;
  isLoading: boolean;
  error: string | null;
  fetchBooks: (options?: { genreId?: string; search?: string }) => Promise<void>;
  fetchMyBooks: (userId: string) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createBook: (userId: string, input: CreateBookInput) => Promise<string>;
  updateBook: (id: string, userId: string, input: UpdateBookInput) => Promise<void>;
  deleteBook: (id: string, userId: string) => Promise<void>;
  clearSelected: () => void;
  clearError: () => void;
}

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  myBooks: [],
  selectedBook: null,
  isLoading: false,
  error: null,

  fetchBooks: async (options) => {
    set({ isLoading: true, error: null });
    try {
      const books = await bookService.fetchBooks(options);
      set({ books, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  fetchMyBooks: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const myBooks = await bookService.fetchBooks({ userId });
      set({ myBooks, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  fetchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const selectedBook = await bookService.fetchBookById(id);
      set({ selectedBook, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  createBook: async (userId, input) => {
    set({ isLoading: true, error: null });
    try {
      const book = await bookService.createBook(userId, input);
      set((state) => ({
        books: [book, ...state.books],
        myBooks: [book, ...state.myBooks],
        isLoading: false,
      }));
      return book.id;
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  updateBook: async (id, userId, input) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await bookService.updateBook(id, userId, input);
      set((state) => ({
        books: state.books.map((b) => (b.id === id ? updated : b)),
        myBooks: state.myBooks.map((b) => (b.id === id ? updated : b)),
        selectedBook: updated,
        isLoading: false,
      }));
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  deleteBook: async (id, userId) => {
    set({ isLoading: true, error: null });
    try {
      await bookService.deleteBook(id, userId);
      set((state) => ({
        books: state.books.filter((b) => b.id !== id),
        myBooks: state.myBooks.filter((b) => b.id !== id),
        selectedBook: state.selectedBook?.id === id ? null : state.selectedBook,
        isLoading: false,
      }));
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  clearSelected: () => set({ selectedBook: null }),
  clearError: () => set({ error: null }),
}));
