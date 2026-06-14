import { createAdminClient } from "@/app/lib/supabase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Settings from "@/app/components/Settings/settings";
import styles from "./page.module.css";

async function getSettingsData() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) redirect("/login");

  const supabase = createAdminClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("user_id")
    .eq("session_id", sessionId)
    .single();

  if (sessionError || !session) redirect("/login");

  const [userResult, countResult] = await Promise.all([
    supabase
      .from("users")
      .select("username, email, avatar, created_at")
      .eq("id", session.user_id)
      .single(),
    supabase
      .from("ambiances")
      .select("id", { count: "exact", head: true })
      .eq("user_id", session.user_id)
      .eq("status", "published"),
  ]);

  if (userResult.error || !userResult.data) redirect("/login");

  const user = userResult.data;
  const hasPublished = !countResult.error && (countResult.count ?? 0) > 0;

  return {
    username: user.username,
    email: user.email,
    avatar: user.avatar as string | null,
    createdAt: user.created_at,
    hasPublished,
  };
}

export default async function Page() {
  const user = await getSettingsData();
  return (
    <div className={styles.settings_page}>
      <div className={styles.wrapper}>
        <Settings user={user} />
      </div>
    </div>
  );
}
