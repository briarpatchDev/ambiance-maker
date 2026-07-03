import cron from "node-cron";
import { createAdminClient } from "@/app/lib/supabase/admin";

export default function startCronJobs() {
  // Weekly cleanup: delete sessions inactive for 90+ days
  // Runs every Sunday at 3:00 AM
  cron.schedule("0 3 * * 0", async () => {
    console.log("[cron] Running stale session cleanup...");
    try {
      const supabase = createAdminClient();
      const cutoff = new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { error, count } = await supabase
        .from("sessions")
        .delete({ count: "exact" })
        .lt("last_active", cutoff);

      if (error) {
        console.error("[cron] Session cleanup failed:", error);
      } else {
        console.log(
          `[cron] Session cleanup complete. Removed ${count ?? 0} stale sessions.`,
        );
      }
    } catch (err) {
      console.error("[cron] Session cleanup unexpected error:", err);
    }
  });

  // Daily at 00:05: snapshot distinct active users for the previous day
  cron.schedule("5 0 * * *", async () => {
    console.log("[cron] Running DAU snapshot...");
    try {
      const supabase = createAdminClient();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const { error } = await supabase.rpc("snapshot_daily_active_users", {
        p_date: yesterday,
      });
      if (error) {
        console.error("[cron] DAU snapshot failed:", error);
      } else {
        console.log(`[cron] DAU snapshot complete for ${yesterday}.`);
      }
    } catch (err) {
      console.error("[cron] DAU snapshot unexpected error:", err);
    }
  });

  // Weekly on Sunday at 03:30: prune ambiance_view_log entries older than 7 days
  cron.schedule("30 3 * * 0", async () => {
    console.log("[cron] Running ambiance view log cleanup...");
    try {
      const supabase = createAdminClient();
      const cutoff = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { error, count } = await supabase
        .from("ambiance_view_log")
        .delete({ count: "exact" })
        .lt("last_viewed", cutoff);
      if (error) {
        console.error("[cron] View log cleanup failed:", error);
      } else {
        console.log(
          `[cron] View log cleanup complete. Removed ${count ?? 0} entries.`,
        );
      }
    } catch (err) {
      console.error("[cron] View log cleanup unexpected error:", err);
    }
  });
}
