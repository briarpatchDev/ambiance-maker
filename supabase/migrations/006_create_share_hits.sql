-- Migration 006: Create share_hits table
-- Tracks hit counts for unique /share links to detect mini-viral sharing.
-- Protected against flooding via:
--   - YouTube ID validation (app layer, before this function is called)
--   - URL length cap (app layer)
--   - Per-table row cap of 1,000 new rows (enforced in track_share_link)
-- Per-link hit count is capped at 10,000.
-- Rows are cleaned up 30 days after last_seen via the cron job.

CREATE TABLE IF NOT EXISTS share_hits (
  link_hash  TEXT PRIMARY KEY,
  url        TEXT NOT NULL,
  hits       INTEGER NOT NULL DEFAULT 1,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast cleanup queries (delete expired rows by last_seen)
CREATE INDEX IF NOT EXISTS idx_share_hits_last_seen
  ON share_hits(last_seen);

-- Index for dashboard queries (top hits descending)
CREATE INDEX IF NOT EXISTS idx_share_hits_hits
  ON share_hits(hits DESC);

-- RLS: no public access; all operations via admin client (bypasses RLS)
ALTER TABLE share_hits ENABLE ROW LEVEL SECURITY;

-- Function: record a share link visit.
-- Always updates existing rows (capped at 10,000 hits).
-- Only inserts new rows when the table is under the 1,000-row cap.
-- The ON CONFLICT in the INSERT handles the rare race condition where two
-- concurrent requests both observe NOT FOUND and both attempt to insert.
CREATE OR REPLACE FUNCTION track_share_link(p_hash TEXT, p_url TEXT)
RETURNS void AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Always update if the link already exists
  UPDATE share_hits
  SET hits     = LEAST(hits + 1, 10000),
      last_seen = now()
  WHERE link_hash = p_hash;

  IF NOT FOUND THEN
    -- New link: only insert when under the row cap
    SELECT COUNT(*) INTO v_count FROM share_hits;
    IF v_count < 1000 THEN
      INSERT INTO share_hits (link_hash, url, hits, first_seen, last_seen)
      VALUES (p_hash, p_url, 1, now(), now())
      ON CONFLICT (link_hash) DO UPDATE
        SET hits      = LEAST(share_hits.hits + 1, 10000),
            last_seen = now();
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;
