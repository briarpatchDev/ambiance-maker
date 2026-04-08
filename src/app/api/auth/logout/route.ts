import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/app/lib/supabase/admin";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (sessionId) {
      // Delete this session from DB
      const supabase = createAdminClient();
      await supabase
        .from("sessions")
        .delete()
        .eq("session_id", sessionId);
    }

    // Clear session cookie
    cookieStore.delete("sessionId");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
