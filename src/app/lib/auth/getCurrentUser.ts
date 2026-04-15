import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    if (!sessionId) return null;

    const isDev = process.env.NODE_ENV === "development";
    const supabase = isDev ? createAdminClient() : createClient(cookies());
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("session_id", sessionId)
      .single();

    if (sessionError || !session) return null;

    const { data: user, error } = await supabase
      .from("users")
      .select("username, avatar")
      .eq("id", session.user_id)
      .single();

    if (error || !user) return null;

    return {
      username: user.username,
      avatar: user.avatar,
    };
  } catch {
    return null;
  }
}

export async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    if (!sessionId) return null;

    const isDev = process.env.NODE_ENV === "development";
    const supabase = isDev ? createAdminClient() : createClient(cookies());
    const { data: session, error } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("session_id", sessionId)
      .single();

    if (error || !session) return null;
    return session.user_id;
  } catch {
    return null;
  }
}
