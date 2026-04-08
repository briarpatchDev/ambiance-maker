import { createAdminClient } from "@/app/lib/supabase/admin";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    if (!sessionId) return null;

    const supabase = createAdminClient();
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("session_id", sessionId)
      .single();

    if (sessionError || !session) return null;

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, username, avatar, role")
      .eq("id", session.user_id)
      .single();

    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
    };
  } catch {
    return null;
  }
}
