import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { getUserId } from "@/app/lib/auth/getCurrentUser";

// GET /api/ambiance/rate?id=ambianceId
// Returns the current user's existing rating (1-5 stars) or null
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ rating: null });
    }

    const ambianceId = req.nextUrl.searchParams.get("id");
    if (!ambianceId || typeof ambianceId !== "string") {
      return NextResponse.json(
        { error: "Missing ambiance ID." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("ambiance_ratings")
      .select("rating")
      .eq("ambiance_id", ambianceId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ rating: null });
    }

    return NextResponse.json({ rating: data.rating });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// POST /api/ambiance/rate { id, rating }
// Upserts a star rating for the current user (DB trigger updates rating_sum/count)
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let body: { id?: unknown; rating?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON." },
        { status: 400 },
      );
    }

    const { id: ambianceId, rating } = body;

    if (!ambianceId || typeof ambianceId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid ambiance ID." },
        { status: 400 },
      );
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Rating must be 1-5." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Verify the ambiance exists, is published, and user isn't the author
    const { data: ambiance, error: ambianceError } = await supabase
      .from("ambiances")
      .select("user_id, status")
      .eq("id", ambianceId)
      .single();

    if (ambianceError || !ambiance || ambiance.status !== "published") {
      return NextResponse.json(
        { error: "Ambiance not found." },
        { status: 404 },
      );
    }

    if (ambiance.user_id === userId) {
      return NextResponse.json(
        { error: "Cannot rate your own ambiance." },
        { status: 403 },
      );
    }

    // Upsert — DB trigger automatically updates rating_sum and rating_count
    const { error: upsertError } = await supabase
      .from("ambiance_ratings")
      .upsert(
        { ambiance_id: ambianceId, user_id: userId, rating: ratingNum },
        { onConflict: "ambiance_id,user_id" },
      );

    if (upsertError) {
      return NextResponse.json(
        { error: "Failed to save rating." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
