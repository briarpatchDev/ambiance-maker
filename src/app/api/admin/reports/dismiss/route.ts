import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyAdmin } from "@/app/lib/auth/adminAuth";

// Dismisses a report (no action taken on the ambiance)
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing report id" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("ambiance_reports")
      .update({ status: "dismissed" })
      .eq("id", id)
      .eq("status", "pending");

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error dismissing report:", err);
    return NextResponse.json(
      { error: "Couldn't complete the request" },
      { status: 500 },
    );
  }
}
