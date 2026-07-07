import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { getUserId } from "@/app/lib/auth/getCurrentUser";

const MAX_FAVORITES = 50;

// GET /api/ambiance/favorite?id=ambianceId
// Returns { favorited: boolean } for the current user. Returns false if not logged in.
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ favorited: false });
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
      .from("ambiance_favorites")
      .select("ambiance_id")
      .eq("user_id", userId)
      .eq("ambiance_id", ambianceId)
      .maybeSingle();

    if (error) return NextResponse.json({ favorited: false });
    return NextResponse.json({ favorited: !!data });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// POST /api/ambiance/favorite { id }
// Toggles the favorite. Returns { favorited: boolean, code?: string }
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let body: { id?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const { id: ambianceId } = body;
    if (!ambianceId || typeof ambianceId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid ambiance ID." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Check if already favorited — if so, remove it (toggle off)
    const { data: existing } = await supabase
      .from("ambiance_favorites")
      .select("ambiance_id")
      .eq("user_id", userId)
      .eq("ambiance_id", ambianceId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("ambiance_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("ambiance_id", ambianceId);
      if (error) {
        return NextResponse.json(
          { error: "Failed to remove favorite." },
          { status: 500 },
        );
      }
      return NextResponse.json({ favorited: false });
    }

    // Enforce the 50-favorite limit before inserting
    const { count } = await supabase
      .from("ambiance_favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count ?? 0) >= MAX_FAVORITES) {
      return NextResponse.json({
        error: "Favorites limit reached.",
        code: "MAX_FAVORITES",
        favorited: false,
      });
    }

    // Verify the ambiance exists, is published, and isn't the user's own
    const { data: ambiance } = await supabase
      .from("ambiances")
      .select("id, user_id")
      .eq("id", ambianceId)
      .eq("status", "published")
      .maybeSingle();

    if (!ambiance) {
      return NextResponse.json(
        { error: "Ambiance not found.", code: "NOT_FOUND", favorited: false },
        { status: 404 },
      );
    }

    if (ambiance.user_id === userId) {
      return NextResponse.json(
        {
          error: "Cannot favorite your own ambiance.",
          code: "OWN_AMBIANCE",
          favorited: false,
        },
        { status: 403 },
      );
    }

    // Insert the favorite
    const { error: insertError } = await supabase
      .from("ambiance_favorites")
      .insert({ user_id: userId, ambiance_id: ambianceId });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to add favorite." },
        { status: 500 },
      );
    }

    return NextResponse.json({ favorited: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
