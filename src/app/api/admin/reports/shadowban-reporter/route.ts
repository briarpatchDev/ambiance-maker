import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyAdmin } from "@/app/lib/auth/adminAuth";

// Shadowbans the reporter and dismisses their report
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

    // Get the report to find the reporter
    const { data: report, error: reportError } = await supabase
      .from("ambiance_reports")
      .select("user_id")
      .eq("id", id)
      .eq("status", "pending")
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 },
      );
    }

    // Shadowban the reporter
    const { error: banError } = await supabase
      .from("users")
      .update({ account_status: "shadowbanned" })
      .eq("id", report.user_id);

    if (banError) throw banError;

    // Dismiss all pending reports from this user
    const { error: dismissError } = await supabase
      .from("ambiance_reports")
      .update({ status: "dismissed" })
      .eq("user_id", report.user_id)
      .eq("status", "pending");

    if (dismissError) throw dismissError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error shadowbanning reporter:", err);
    return NextResponse.json(
      { error: "Couldn't complete the request" },
      { status: 500 },
    );
  }
}
