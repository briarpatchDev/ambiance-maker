import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { randomString } from "@/app/lib/randomString";
import { cookies } from "next/headers";
import {
  submitAmbianceSchema,
  getVideoId,
  transformVideoDataForStorage,
  type VideoDataInput,
} from "@/app/lib/schemas/ambiance";

// Dev user ID - used consistently across development
const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

// Submits the video for publication
export async function POST(req: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const cookieStore = cookies();

    // In dev, use admin client to bypass RLS; in prod, use regular client
    const supabase = isDev ? createAdminClient() : createClient(cookieStore);

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = isDev
      ? { data: { user: { id: DEV_USER_ID } }, error: null }
      : await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to submit an ambiance." },
        { status: 401 },
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 },
      );
    }

    // Transform the v1-v6 format to videoData array if needed
    let transformedBody = body as Record<string, unknown>;
    if (!transformedBody.videoData && transformedBody.v1 !== undefined) {
      const videoData: VideoDataInput[] = [];
      for (let i = 1; i <= 6; i++) {
        const videoKey = `v${i}` as keyof typeof transformedBody;
        const video = transformedBody[videoKey] as VideoDataInput | undefined;
        videoData.push({
          src: video?.src || "",
          volume: video?.volume,
          startTime: video?.startTime,
          endTime: video?.endTime,
          playbackSpeed: video?.playbackSpeed,
        });
      }
      transformedBody = {
        id: transformedBody.id,
        title: transformedBody.title,
        description: transformedBody.description,
        videoData,
      };
    }

    // Validate with Zod
    const parseResult = submitAmbianceSchema.safeParse(transformedBody);

    if (!parseResult.success) {
      console.error("Validation errors:", parseResult.error.issues);
      return NextResponse.json(
        { error: "Invalid submission data." },
        { status: 400 },
      );
    }

    const { id, title, description, videoData } = parseResult.data;

    // Ensure at least 2 videos have valid sources
    const validVideoCount = videoData.filter(
      (v) => v.src && getVideoId(v.src),
    ).length;
    if (validVideoCount < 2) {
      return NextResponse.json(
        { error: "At least 2 videos with valid YouTube URLs are required." },
        { status: 400 },
      );
    }

    // Transform video data to extract just the video IDs for storage
    const videoDataForStorage = transformVideoDataForStorage(videoData);

    let ambiance;
    let error;

    if (id) {
      // Update existing ambiance to submitted - verify ownership first
      const { data: existing } = await supabase
        .from("ambiances")
        .select("user_id, status")
        .eq("id", id)
        .single();

      if (!existing) {
        return NextResponse.json(
          { error: "Ambiance not found." },
          { status: 404 },
        );
      }

      if (existing.user_id !== user.id) {
        return NextResponse.json(
          { error: "You do not own this ambiance." },
          { status: 403 },
        );
      }

      if (existing.status === "published") {
        return NextResponse.json(
          { error: "This ambiance is already published." },
          { status: 400 },
        );
      }

      // Update and submit
      const result = await supabase
        .from("ambiances")
        .update({
          title,
          description,
          status: "submitted",
          video_data: videoDataForStorage,
        })
        .eq("id", id)
        .select("id, title, status, created_at, updated_at")
        .single();

      ambiance = result.data;
      error = result.error;
    } else {
      // Check unpublished limit before creating new submission
      const { count } = await supabase
        .from("ambiances")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .in("status", ["draft", "submitted"]);

      if (count !== null && count >= 50) {
        return NextResponse.json(
          {
            error:
              "You've reached the maximum of 50 unpublished ambiances. Please delete some drafts to create new ones.",
          },
          { status: 400 },
        );
      }

      // Insert new submission directly (retry on collision)
      for (let attempt = 0; attempt < 3; attempt++) {
        const newId = randomString(12);
        const result = await supabase
          .from("ambiances")
          .insert({
            id: newId,
            user_id: user.id,
            title,
            description,
            status: "submitted",
            video_data: videoDataForStorage,
          })
          .select("id, title, status, created_at")
          .single();

        if (result.error) continue;
        ambiance = result.data;
        error = result.error;
        break;
      }
    }

    if (error) {
      console.error("Error submitting ambiance:", error);
      return NextResponse.json(
        { error: "Failed to submit ambiance. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Ambiance submitted successfully! It will be reviewed for publication.",
      ambiance,
    });
  } catch (error) {
    console.error("Unexpected error in submit route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
