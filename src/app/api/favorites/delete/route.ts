import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { getUserId } from "@/app/lib/auth/getCurrentUser";

// DELETE /api/favorites/delete { items: string[] }
// Removes the given ambiance IDs from the current user's favorites list.
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, logout: true, error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    let body: { items?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON." },
        { status: 400 },
      );
    }

    const { items } = body;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items provided." },
        { status: 400 },
      );
    }

    if (!items.every((item) => typeof item === "string")) {
      return NextResponse.json(
        { success: false, error: "Invalid item IDs." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("ambiance_favorites")
      .delete()
      .eq("user_id", userId)
      .in("ambiance_id", items);

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to remove favorites." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
