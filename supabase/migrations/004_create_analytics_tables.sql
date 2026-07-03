-- Migration 004: Create analytics tables
-- ambiance_view_log: 7-day rolling dedup window per (ambiance, viewer)
-- daily_metrics: live daily counters for page views, ambiance views, and DAU
-- All DB operations go through the admin client (service role key) which bypasses RLS.

-- Create ambiance_view_log table
CREATE TABLE IF NOT EXISTS ambiance_view_log (
  ambiance_id  VARCHAR(12) NOT NULL REFERENCES ambiances(id) ON DELETE CASCADE,
  viewer_key   TEXT NOT NULL,
  last_viewed  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ambiance_id, viewer_key)
);

-- Index for fast cleanup queries (delete expired rows by last_viewed)
CREATE INDEX IF NOT EXISTS idx_ambiance_view_log_last_viewed
  ON ambiance_view_log(last_viewed);

-- Create daily_metrics table
-- views_home/create/share and ambiance_views are live-incremented throughout the day.
-- daily_active_users is written once per day by the nightly cron job.
CREATE TABLE IF NOT EXISTS daily_metrics (
  date                DATE PRIMARY KEY,
  views_home          INTEGER NOT NULL DEFAULT 0,
  views_create        INTEGER NOT NULL DEFAULT 0,
  views_share         INTEGER NOT NULL DEFAULT 0,
  ambiance_views      INTEGER NOT NULL DEFAULT 0,
  daily_active_users  INTEGER NOT NULL DEFAULT 0
);

-- RLS: no public access; all operations via admin client (bypasses RLS)
ALTER TABLE ambiance_view_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Fix: update the ambiances updated_at trigger so view count increments
-- do not bump updated_at (only content edits should update it)
DROP TRIGGER IF EXISTS update_ambiances_updated_at ON ambiances;
CREATE TRIGGER update_ambiances_updated_at
  BEFORE UPDATE ON ambiances
  FOR EACH ROW
  WHEN (
    OLD.title IS DISTINCT FROM NEW.title OR
    OLD.description IS DISTINCT FROM NEW.description OR
    OLD.video_data IS DISTINCT FROM NEW.video_data OR
    OLD.status IS DISTINCT FROM NEW.status OR
    OLD.thumbnail IS DISTINCT FROM NEW.thumbnail OR
    OLD.category_id IS DISTINCT FROM NEW.category_id
  )
  EXECUTE FUNCTION update_updated_at_column();

-- Function: atomically increment a page view counter for today
CREATE OR REPLACE FUNCTION increment_page_view(p_page TEXT, p_date DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_metrics (date) VALUES (p_date) ON CONFLICT (date) DO NOTHING;
  IF p_page = 'home' THEN
    UPDATE daily_metrics SET views_home = views_home + 1 WHERE date = p_date;
  ELSIF p_page = 'create' THEN
    UPDATE daily_metrics SET views_create = views_create + 1 WHERE date = p_date;
  ELSIF p_page = 'share' THEN
    UPDATE daily_metrics SET views_share = views_share + 1 WHERE date = p_date;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: record an ambiance view with 7-day per-viewer deduplication.
-- Also increments ambiances.views and daily_metrics.ambiance_views on valid views.
-- Returns TRUE if the view was counted, FALSE if it was a duplicate within 7 days.
CREATE OR REPLACE FUNCTION record_ambiance_view(
  p_ambiance_id VARCHAR(12),
  p_viewer_key  TEXT,
  p_date        DATE
) RETURNS BOOLEAN AS $$
DECLARE
  v_last_viewed TIMESTAMPTZ;
BEGIN
  SELECT last_viewed INTO v_last_viewed
  FROM ambiance_view_log
  WHERE ambiance_id = p_ambiance_id AND viewer_key = p_viewer_key;

  IF v_last_viewed IS NULL OR v_last_viewed < now() - INTERVAL '7 days' THEN
    INSERT INTO ambiance_view_log (ambiance_id, viewer_key, last_viewed)
    VALUES (p_ambiance_id, p_viewer_key, now())
    ON CONFLICT (ambiance_id, viewer_key)
    DO UPDATE SET last_viewed = now();

    UPDATE ambiances SET views = views + 1 WHERE id = p_ambiance_id;

    INSERT INTO daily_metrics (date) VALUES (p_date) ON CONFLICT (date) DO NOTHING;
    UPDATE daily_metrics SET ambiance_views = ambiance_views + 1 WHERE date = p_date;

    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function: snapshot distinct active users for a given date into daily_metrics.
-- Called by the nightly cron job for the previous day.
CREATE OR REPLACE FUNCTION snapshot_daily_active_users(p_date DATE)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO v_count
  FROM sessions
  WHERE last_active >= p_date
    AND last_active < p_date + INTERVAL '1 day';

  INSERT INTO daily_metrics (date, daily_active_users)
  VALUES (p_date, v_count)
  ON CONFLICT (date)
  DO UPDATE SET daily_active_users = v_count;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;
