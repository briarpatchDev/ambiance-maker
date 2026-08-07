import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyAdmin } from "@/app/lib/auth/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ("error" in auth) return auth.error;

    const searchParams = req.nextUrl.searchParams;
    const minHits = Math.max(1, Number(searchParams.get("min_hits")) || 50);
    const days = Math.min(90, Math.max(1, Number(searchParams.get("days")) || 7));

    const supabase = createAdminClient();
    const cutoff = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data, error } = await supabase
      .from("share_hits")
      .select("link_hash, url, hits, first_seen, last_seen")
      .gte("hits", minHits)
      .gte("last_seen", cutoff)
      .order("hits", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ items: data ?? [] });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch share hits" },
      { status: 500 },
    );
  }
}
