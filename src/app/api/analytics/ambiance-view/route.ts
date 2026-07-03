import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { createHash } from "crypto";

// Ambiance IDs are 12-char alphanumeric strings
const AMBIANCE_ID_RE = /^[a-zA-Z0-9]{1,12}$/;

function buildViewerKey(req: NextRequest, userId: string | null): string {
  if (userId) return `user:${userId}`;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";
  return `anon:${createHash("sha256").update(`${ip}:${ua}`).digest("hex")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ambianceId: string = body?.ambianceId;

    if (!ambianceId || !AMBIANCE_ID_RE.test(ambianceId)) {
      return NextResponse.json({}, { status: 400 });
    }

    const supabase = createAdminClient();
    const today = new Date().toISOString().slice(0, 10);

    // Resolve viewer identity: prefer authenticated user_id over anonymous fingerprint
    let userId: string | null = null;
    const sessionId = req.cookies.get("sessionId")?.value;
    if (sessionId) {
      const { data } = await supabase
        .from("sessions")
        .select("user_id")
        .eq("session_id", sessionId)
        .single();
      userId = data?.user_id ?? null;
    }

    const viewerKey = buildViewerKey(req, userId);

    await supabase.rpc("record_ambiance_view", {
      p_ambiance_id: ambianceId,
      p_viewer_key: viewerKey,
      p_date: today,
    });

    return NextResponse.json({});
  } catch {
    return NextResponse.json({});
  }
}
