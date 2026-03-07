import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyAdmin } from "@/app/lib/auth/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing ambiance id" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Look up the user_id from the ambiance
    const { data: ambiance, error: fetchError } = await supabase
      .from("ambiances")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !ambiance) {
      return NextResponse.json(
        { error: "Ambiance not found" },
        { status: 404 },
      );
    }

    // Set the user's account_status to shadowbanned
    const { error } = await supabase
      .from("users")
      .update({ account_status: "shadowbanned" })
      .eq("id", ambiance.user_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error shadowbanning user:", err);
    return NextResponse.json(
      { error: "Couldn't complete the request" },
      { status: 500 },
    );
  }
}
