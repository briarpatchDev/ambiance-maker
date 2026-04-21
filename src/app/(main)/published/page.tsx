import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PublishedContent from "./client";

async function verifySession() {
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
}

export default async function Page() {
  await verifySession();
  return <PublishedContent />;
}
