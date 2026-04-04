import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyAdmin } from "@/app/lib/auth/adminAuth";

// Resolves a report by taking action on the ambiance (depublish or delete)
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ("error" in auth) return auth.error;

    const { id, action } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing report id" },
        { status: 400 },
      );
    }

    if (action !== "depublish" && action !== "delete") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'depublish' or 'delete'." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Get the report to find the ambiance
    const { data: report, error: reportError } = await supabase
      .from("ambiance_reports")
      .select("ambiance_id")
      .eq("id", id)
      .eq("status", "pending")
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 },
      );
    }

    // Take action on the ambiance
    if (action === "depublish") {
      const { error } = await supabase
        .from("ambiances")
        .update({ status: "draft", published_at: null })
        .eq("id", report.ambiance_id);

      if (error) throw error;
    } else if (action === "delete") {
      const { error } = await supabase
        .from("ambiances")
        .delete()
        .eq("id", report.ambiance_id);

      if (error) throw error;
    }

    // Mark this report and any other pending reports for the same ambiance as resolved
    const { error: updateError } = await supabase
      .from("ambiance_reports")
      .update({ status: "resolved" })
      .eq("ambiance_id", report.ambiance_id)
      .eq("status", "pending");

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error resolving report:", err);
    return NextResponse.json(
      { error: "Couldn't complete the request" },
      { status: 500 },
    );
  }
}
