import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, logout: true, error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const supabase = createAdminClient();

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("session_id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, logout: true, error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("username, email, avatar, created_at")
      .eq("id", session.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 },
      );
    }

    const { count, error: countError } = await supabase
      .from("ambiances")
      .select("id", { count: "exact", head: true })
      .eq("user_id", session.user_id)
      .eq("status", "published");

    const hasPublished = !countError && (count ?? 0) > 0;

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.created_at,
        hasPublished,
      },
    });
  } catch (err) {
    console.error("Get settings unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
