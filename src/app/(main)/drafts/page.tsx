import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DraftsContent from "./client";

async function getDrafts() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  const isDev = process.env.NODE_ENV === "development";
  const supabase = isDev ? createAdminClient() : createClient(cookies());
  const { data: session, error } = await supabase
    .from("sessions")
    .select("user_id")
    .eq("session_id", sessionId)
    .single();
  if (error || !session || !session.user_id) {
    redirect("/login");
  }
  const { data: drafts, error: draftsError } = await supabase
    .from("ambiances")
    .select()
    .eq("user_id", session!.user_id)
    .in("status", ["draft", "submitted"]);
  return drafts;
}

export default async function Page() {
  const drafts = await getDrafts();
  return <DraftsContent drafts={drafts} />;
}
