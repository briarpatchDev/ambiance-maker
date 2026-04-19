import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PublishedContent from "./client";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";

async function getPublishedAmbiances() {
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
    .select("id, title, thumbnail, views, status, published_at")
    .eq("user_id", session!.user_id)
    .in("status", ["published"]);
  return drafts;
}

export default async function Page() {
  const ambianceData = await getPublishedAmbiances();
  if (!ambianceData) return <PublishedContent ambiances={[]} />;
  ambianceData.sort(function (a, b) {
    return (
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  });
  const ambiance: AmbianceData[] = ambianceData.map((entry) => {
    return {
      id: entry.id,
      title: entry.title,
      status: entry.status,
      thumbnail: entry.thumbnail,
      views: entry.views,
      datePublished: new Date(entry.published_at),
      videoData: [],
    };
  });
  return <PublishedContent ambiances={ambiance} />;
}
