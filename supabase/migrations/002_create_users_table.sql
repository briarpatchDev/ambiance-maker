-- Migration: Create users table for app-specific profile data
-- This links to auth.users (managed by Supabase Auth / Google OAuth)

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username VARCHAR(32) UNIQUE NOT NULL,
  account_status VARCHAR(20) NOT NULL DEFAULT 'good' CHECK (account_status IN ('good', 'shadowbanned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for username lookups (profile pages, uniqueness checks)
CREATE INDEX idx_users_username ON users(username);

-- Index for moderation queries
CREATE INDEX idx_users_account_status ON users(account_status);

-- ============================================
-- Auto-create user profile on Google sign-up
-- ============================================

CREATE OR REPLACE FUNCTION generate_random_username()
RETURNS TEXT AS $$
DECLARE
  adjectives TEXT[] := ARRAY[
    'Swift', 'Bright', 'Calm', 'Clever', 'Cosmic',
    'Azure', 'Bold', 'Chill', 'Eager', 'Fizzy',
    'Gentle', 'Golden', 'Happy', 'Keen', 'Lucky',
    'Mellow', 'Radiant', 'Noble', 'Plucky', 'Vivid',
    'Rustic', 'Sandy', 'Silent', 'Silver', 'Snowy',
    'Stellar', 'Speedy', 'Starry', 'Sunny', 'Crimson',
    'Wandering', 'Whimsy', 'Winter', 'Wispy', 'Zesty'
  ];
  nouns TEXT[] := ARRAY[
    'Anchor', 'Bison', 'Breeze', 'Condor', 'Cedar',
    'Cloud', 'Comet', 'Coral', 'Crane', 'Dune',
    'Falcon', 'Lotus', 'Finch', 'Forest', 'Frost',
    'Gazelle', 'Harbor', 'Hawk', 'Heron', 'Horizon',
    'Lantern', 'Leaf', 'Ember', 'Meadow', 'Moon',
    'Nebula', 'Oakley', 'Orchid', 'Penguin', 'Owl',
    'Panda', 'Pebble', 'Phoenix', 'Pine', 'Quill',
    'Raven', 'Reed', 'Ridge', 'River', 'Robin',
    'Sage', 'Sparrow', 'Stone', 'Storm', 'Summit',
    'Thistle', 'Tide', 'Timber', 'Wren', 'Zenith'
  ];
  adj TEXT;
  noun TEXT;
  num TEXT;
BEGIN
  adj := adjectives[1 + floor(random() * array_length(adjectives, 1))];
  noun := nouns[1 + floor(random() * array_length(nouns, 1))];
  num := floor(random() * 1000)::TEXT;
  RETURN adj || noun || num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_username TEXT;
  attempts INT := 0;
BEGIN
  -- Try to generate a unique username (retry on collision)
  LOOP
    new_username := generate_random_username();
    BEGIN
      INSERT INTO public.users (id, email, username)
      VALUES (NEW.id, NEW.email, new_username);
      RETURN NEW;
    EXCEPTION WHEN unique_violation THEN
      attempts := attempts + 1;
      IF attempts >= 10 THEN
        -- Fallback: append more random chars
        new_username := new_username || SUBSTR(MD5(RANDOM()::TEXT), 1, 4);
        INSERT INTO public.users (id, email, username)
        VALUES (NEW.id, NEW.email, new_username);
        RETURN NEW;
      END IF;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: runs after a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view any profile (public profiles)
CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No direct inserts (handled by trigger)
-- No deletes (cascades from auth.users)

-- ============================================
-- Development: Create test user
-- ============================================

-- Insert dev user into auth.users first
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dev@localhost.local',
  crypt('devpassword123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- Insert dev user profile (trigger won't fire for manual inserts above)
INSERT INTO public.users (id, email, username, account_status)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dev@localhost.local',
  'dev_user',
  'good'
)
ON CONFLICT (id) DO NOTHING;
