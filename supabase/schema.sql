-- ============================================================
-- BookShelf — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Profiles (mirrors auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    text NOT NULL,
  avatar_url  text,
  bio         text,
  created_at  timestamptz DEFAULT now()
);

-- Genres (display entity — seed with INSERT below)
CREATE TABLE IF NOT EXISTS genres (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name  text NOT NULL UNIQUE,
  icon  text NOT NULL DEFAULT '📚',
  color text NOT NULL DEFAULT '#2563eb'
);

-- Books (CRUD entity)
CREATE TABLE IF NOT EXISTS books (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           text NOT NULL,
  author          text NOT NULL,
  cover_url       text,
  description     text,
  total_pages     integer,
  year_published  integer,
  is_public       boolean NOT NULL DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Book <-> Genre (M:N relationship)
CREATE TABLE IF NOT EXISTS book_genres (
  book_id   uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  genre_id  uuid NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, genre_id)
);

-- Reading progress (relationship: book + user)
CREATE TABLE IF NOT EXISTS reading_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id      uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'want_to_read'
                 CHECK (status IN ('want_to_read', 'reading', 'finished')),
  current_page integer,
  rating       integer CHECK (rating BETWEEN 1 AND 5),
  notes        text,
  started_at   date,
  finished_at  date,
  UNIQUE (book_id, user_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres          ENABLE ROW LEVEL SECURITY;
ALTER TABLE books           ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_genres     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- profiles: anyone can read, only owner can update
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- genres: public read-only
CREATE POLICY "genres_select" ON genres FOR SELECT USING (true);

-- books: public can read public books; owner can do everything
CREATE POLICY "books_select_public" ON books FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "books_insert"        ON books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "books_update"        ON books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "books_delete"        ON books FOR DELETE USING (auth.uid() = user_id);

-- book_genres: follow book ownership
CREATE POLICY "book_genres_select" ON book_genres FOR SELECT USING (
  EXISTS (SELECT 1 FROM books b WHERE b.id = book_id AND (b.is_public OR auth.uid() = b.user_id))
);
CREATE POLICY "book_genres_insert" ON book_genres FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM books b WHERE b.id = book_id AND auth.uid() = b.user_id)
);
CREATE POLICY "book_genres_delete" ON book_genres FOR DELETE USING (
  EXISTS (SELECT 1 FROM books b WHERE b.id = book_id AND auth.uid() = b.user_id)
);

-- reading_progress: only owner
CREATE POLICY "reading_select" ON reading_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reading_insert" ON reading_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reading_update" ON reading_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reading_delete" ON reading_progress FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Seed: Genres
-- ============================================================

INSERT INTO genres (name, icon, color) VALUES
  ('Ficção Científica', '🚀', '#7c3aed'),
  ('Fantasia',          '🧙', '#6d28d9'),
  ('Romance',           '💕', '#db2777'),
  ('Suspense',          '🔍', '#0f172a'),
  ('Terror',            '👻', '#991b1b'),
  ('Aventura',          '🗺️', '#d97706'),
  ('Biografia',         '📖', '#0369a1'),
  ('História',          '🏛️', '#065f46'),
  ('Autoajuda',         '🌱', '#16a34a'),
  ('Tecnologia',        '💻', '#0284c7'),
  ('Poesia',            '🎭', '#7e22ce'),
  ('Mangá',             '🎌', '#dc2626')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Auto-create profile on signup (trigger)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
