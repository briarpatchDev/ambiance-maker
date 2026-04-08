import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { cookies } from "next/headers";

const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Verifies the request is from an authenticated admin user.
 * Returns the user ID on success, or a NextResponse error to send back.
 */
export async function verifyAdmin(): Promise<
  { userId: string } | { error: NextResponse }
> {
  const isDev = process.env.NODE_ENV === "development";
  const supabase = createAdminClient();

  let userId: string;

  if (isDev) {
    userId = DEV_USER_ID;
  } else {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    if (!sessionId) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized. Please log in." },
          { status: 401 },
        ),
      };
    }

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("session_id", sessionId)
      .single();

    if (sessionError || !session) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized. Please log in." },
          { status: 401 },
        ),
      };
    }

    const { data: user, error: authError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", session.user_id)
      .single();

    if (authError || !user) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized. Please log in." },
          { status: 401 },
        ),
      };
    }

    if (user.role !== "admin") {
      return {
        error: NextResponse.json(
          { error: "Forbidden. Admin access required." },
          { status: 403 },
        ),
      };
    }

    userId = user.id;
  }

  // Dev mode: still verify admin role exists
  if (isDev) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return {
        error: NextResponse.json(
          { error: "Forbidden. Admin access required." },
          { status: 403 },
        ),
      };
    }
  }

  return { userId };
}
