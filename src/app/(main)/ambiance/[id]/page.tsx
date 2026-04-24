import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { cookies } from "next/headers";
import AmbianceClient from "./client";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getAmbiance(ambianceId: string): Promise<
  | {
      ambianceData: AmbianceData;
    }
  | undefined
> {
  const isDev = process.env.NODE_ENV === "development";
  const supabase = isDev ? createAdminClient() : createClient(cookies());

  // Gets the ambiance data
  const { data: ambiance, error } = await supabase
    .from("ambiances")
    .select(
      "id, user_id, title, status, description, video_data, category_id, user_id, published_at, views",
    )
    .eq("id", ambianceId)
    .single();
  if (error || !ambiance || ambiance.status !== "published") {
    return undefined;
  }
  // Gets the username
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("username")
    .eq("id", ambiance.user_id)
    .single();
  if (error || !user) {
    return undefined;
  }
  // Transform video_data from stored format to VideoData[]
  const videoData = (ambiance.video_data as any[]).map((v: any) => ({
    src: v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : "",
    startTime: v.startTime,
    endTime: v.endTime,
    volume: v.volume,
    playbackSpeed: v.playbackSpeed,
  }));
  return {
    ambianceData: {
      id: ambiance.id,
      title: ambiance.title,
      author: user.username,
      description: ambiance.description,
      views: ambiance.views,
      datePublished: ambiance.published_at,
      videoData: videoData,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const ambianceData = await getAmbiance(id);
  return <AmbianceClient ambianceData={ambianceData?.ambianceData} />;
}
