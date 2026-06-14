import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { getUserId } from "@/app/lib/auth/getCurrentUser";

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, logout: true, error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body." },
        { status: 400 },
      );
    }

    const { username } = body as { username?: string };

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { success: false, error: "Username is required." },
        { status: 400 },
      );
    }

    const trimmed = username.trim();

    if (trimmed.length < 3 || trimmed.length > 16) {
      return NextResponse.json(
        {
          success: false,
          error: "Username must be between 3 and 16 characters.",
        },
        { status: 400 },
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return NextResponse.json(
        {
          success: false,
          error: "Username may only contain letters, numbers, and underscores.",
        },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Block username change if user has published ambiances
    const { count, error: countError } = await supabase
      .from("ambiances")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "published");

    if (countError) {
      return NextResponse.json(
        { success: false, error: "An unexpected error occurred." },
        { status: 500 },
      );
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Username cannot be changed once you have published ambiances.",
        },
        { status: 403 },
      );
    }

    const { error } = await supabase
      .from("users")
      .update({ username: trimmed })
      .eq("id", userId);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "That username is already taken." },
          { status: 409 },
        );
      }
      console.error("Update username error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update username." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, username: trimmed });
  } catch (err) {
    console.error("Update username unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
