-- Migration: Create ambiances and ambiance_ratings tables
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ambiances table
CREATE TABLE IF NOT EXISTS ambiances (
  id VARCHAR(12) PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(64) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'published')),
  video_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  views INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0
);

-- Create index for faster user lookups
CREATE INDEX idx_ambiances_user_id ON ambiances(user_id);

-- Create index for status filtering (e.g., fetching all published ambiances)
CREATE INDEX idx_ambiances_status ON ambiances(status);

-- Create index for sorting by created_at
CREATE INDEX idx_ambiances_created_at ON ambiances(created_at DESC);

-- Create ambiance_ratings table (prevents duplicate votes)
CREATE TABLE IF NOT EXISTS ambiance_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambiance_id VARCHAR(12) REFERENCES ambiances(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ambiance_id, user_id)  -- One vote per user per ambiance
);

-- Create index for faster ambiance rating lookups
CREATE INDEX idx_ambiance_ratings_ambiance_id ON ambiance_ratings(ambiance_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on ambiances
CREATE TRIGGER update_ambiances_updated_at
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
CREATE TRIGGER update_rating_stats
  AFTER INSERT OR UPDATE OR DELETE ON ambiance_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_ambiance_rating_stats();

-- Row Level Security (RLS) policies

-- Enable RLS on ambiances
ALTER TABLE ambiances ENABLE ROW LEVEL SECURITY;

-- Users can view their own ambiances (any status)
CREATE POLICY "Users can view own ambiances"
  ON ambiances FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can view published ambiances
CREATE POLICY "Anyone can view published ambiances"
  ON ambiances FOR SELECT
  USING (status = 'published');

-- Users can insert their own ambiances
CREATE POLICY "Users can insert own ambiances"
  ON ambiances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ambiances (but not change to published - that's for moderators)
CREATE POLICY "Users can update own ambiances"
  ON ambiances FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status != 'published');

-- Users can delete their own draft ambiances
CREATE POLICY "Users can delete own drafts"
  ON ambiances FOR DELETE
  USING (auth.uid() = user_id AND status = 'draft');

-- Enable RLS on ambiance_ratings
ALTER TABLE ambiance_ratings ENABLE ROW LEVEL SECURITY;

-- Users can view all ratings
CREATE POLICY "Anyone can view ratings"
  ON ambiance_ratings FOR SELECT
  USING (true);

-- Users can insert their own ratings
CREATE POLICY "Users can insert own ratings"
  ON ambiance_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings"
  ON ambiance_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings"
  ON ambiance_ratings FOR DELETE
  USING (auth.uid() = user_id);
