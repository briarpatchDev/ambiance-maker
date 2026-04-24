-- Migration 002: Create ambiances and ambiance_ratings tables
-- Both tables reference public.users(id) for profile joins and cascade deletes.
-- All DB operations go through the admin client (service role key) which bypasses RLS.

-- Create ambiances table
CREATE TABLE IF NOT EXISTS ambiances (
  id VARCHAR(12) PRIMARY KEY,
  user_id UUID NOT NULL
    REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(64) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'published')),
  video_data JSONB NOT NULL,
  category_id INTEGER NOT NULL DEFAULT 0,
  thumbnail VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  views INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  -- Bayesian average: prior of 50 ratings at assumed mean of 70 (scale 1-99)
  -- Pulls low-volume ambiances toward the mean; converges to true average at scale
  rating_score FLOAT GENERATED ALWAYS AS (
    (rating_sum + 70.0 * 50) / (rating_count + 50)
  ) STORED
);

-- Patch for existing DBs: add rating_score if the table already existed without it
ALTER TABLE ambiances
  ADD COLUMN IF NOT EXISTS rating_score FLOAT GENERATED ALWAYS AS (
    (rating_sum + 70.0 * 50) / (rating_count + 50)
  ) STORED;

-- Patch for existing DBs: expand rating scale from 1-5 to 1-99
ALTER TABLE ambiance_ratings
  DROP CONSTRAINT IF EXISTS ambiance_ratings_rating_check;
ALTER TABLE ambiance_ratings
  ADD CONSTRAINT ambiance_ratings_rating_check CHECK (rating >= 1 AND rating <= 99);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_ambiances_user_id ON ambiances(user_id);

-- Create index for status filtering (e.g., fetching all published ambiances)
CREATE INDEX IF NOT EXISTS idx_ambiances_status ON ambiances(status);

-- Create index for sorting by created_at
CREATE INDEX IF NOT EXISTS idx_ambiances_created_at ON ambiances(created_at DESC);

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_ambiances_category_id ON ambiances(category_id);

-- Create index for best sort (rating_score DESC, filtered by rating_count >= 50)
CREATE INDEX IF NOT EXISTS idx_ambiances_rating_score ON ambiances(rating_score DESC) WHERE rating_count >= 50;

-- Create ambiance_ratings table (prevents duplicate votes)
CREATE TABLE IF NOT EXISTS ambiance_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambiance_id VARCHAR(12) REFERENCES ambiances(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL
    REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 99),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ambiance_id, user_id)  -- One vote per user per ambiance
);

-- Create index for faster ambiance rating lookups
CREATE INDEX IF NOT EXISTS idx_ambiance_ratings_ambiance_id ON ambiance_ratings(ambiance_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on ambiances
CREATE OR REPLACE TRIGGER update_ambiances_updated_at
  BEFORE UPDATE ON ambiances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update rating_sum and rating_count when a rating is added/updated/deleted
CREATE OR REPLACE FUNCTION update_ambiance_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ambiances
    SET rating_sum = rating_sum + NEW.rating,
        rating_count = rating_count + 1
    WHERE id = NEW.ambiance_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE ambiances
    SET rating_sum = rating_sum - OLD.rating + NEW.rating
    WHERE id = NEW.ambiance_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ambiances
    SET rating_sum = rating_sum - OLD.rating,
        rating_count = rating_count - 1
    WHERE id = OLD.ambiance_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating stats
CREATE OR REPLACE TRIGGER update_rating_stats
  AFTER INSERT OR UPDATE OR DELETE ON ambiance_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_ambiance_rating_stats();

-- Row Level Security (RLS) policies
-- RLS is enabled as a safety net. All app operations use the admin client (bypasses RLS).

-- Enable RLS on ambiances
ALTER TABLE ambiances ENABLE ROW LEVEL SECURITY;

-- Anyone can view published ambiances
DROP POLICY IF EXISTS "Anyone can view published ambiances" ON ambiances;
CREATE POLICY "Anyone can view published ambiances"
  ON ambiances FOR SELECT
  USING (status = 'published');

-- No direct insert/update/delete via public client

-- Enable RLS on ambiance_ratings
ALTER TABLE ambiance_ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can view ratings
DROP POLICY IF EXISTS "Anyone can view ratings" ON ambiance_ratings;
CREATE POLICY "Anyone can view ratings"
  ON ambiance_ratings FOR SELECT
  USING (true);

-- No direct insert/update/delete via public client
