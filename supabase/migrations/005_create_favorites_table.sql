-- Migration 005: Create ambiance_favorites table
-- A private join table letting users bookmark up to 50 published ambiances.
-- The 50-item limit is enforced in the API layer, not here.
-- Deleting a user or an ambiance cascades to remove all related favorites.

CREATE TABLE IF NOT EXISTS ambiance_favorites (
  user_id UUID NOT NULL
    REFERENCES public.users(id) ON DELETE CASCADE,
  ambiance_id VARCHAR(12) NOT NULL
    REFERENCES ambiances(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, ambiance_id)
);

-- Index for fast per-user lookups (the primary query pattern: "get all favorites for user X")
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON ambiance_favorites(user_id);

-- Index for finding all favorites pointing at a specific ambiance (e.g., cascade awareness)
CREATE INDEX IF NOT EXISTS idx_favorites_ambiance_id ON ambiance_favorites(ambiance_id);

-- RLS (all app operations go through the admin client which bypasses RLS)
ALTER TABLE ambiance_favorites ENABLE ROW LEVEL SECURITY;
