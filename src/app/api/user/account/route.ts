import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { getUserId } from "@/app/lib/auth/getCurrentUser";
import { cookies } from "next/headers";

export async function DELETE() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, logout: true, error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const supabase = createAdminClient();

    // Deleting the user cascades to ambiances, ratings, reports, and sessions
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.error("Delete account error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete account." },
        { status: 500 },
      );
    }

    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete("sessionId");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
