import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
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
  const supabase = isDev ? createAdminClient() : createClient(cookies());

  // Authenticate
  const {
    data: { user },
    error: authError,
  } = isDev
    ? { data: { user: { id: DEV_USER_ID } }, error: null }
    : await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      ),
    };
  }

  // Check admin role
  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return {
      error: NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 },
      ),
    };
  }

  return { userId: user.id };
}
