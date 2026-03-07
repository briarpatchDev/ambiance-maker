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

    const { error } = await supabase
      .from("ambiances")
      .update({ status: "draft" })
      .eq("id", id)
      .eq("status", "submitted");

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error rejecting ambiance:", err);
    return NextResponse.json(
      { error: "Couldn't complete the request" },
      { status: 500 },
    );
  }
}
