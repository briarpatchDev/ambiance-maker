import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { createHash } from "crypto";

const VALID_PAGES = ["home", "create", "share"] as const;
const MAX_SHARE_PARAMS_LENGTH = 600;
// YouTube IDs in share params are encoded as id{11-char-id}
const YOUTUBE_ID_RE = /id([\.\w-]{11})/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page: string = body?.page;

    if (!VALID_PAGES.includes(page as (typeof VALID_PAGES)[number])) {
      return NextResponse.json({}, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);
    await createAdminClient().rpc("increment_page_view", {
      p_page: page,
      p_date: today,
    });

    // Track individual share links when the page is "share"
    if (page === "share") {
      const shareParams: unknown = body?.shareParams;
      if (
        typeof shareParams === "string" &&
        shareParams.length > 0 &&
        shareParams.length <= MAX_SHARE_PARAMS_LENGTH &&
        YOUTUBE_ID_RE.test(shareParams)
      ) {
        // Canonicalise params by sorting keys so param order doesn't affect the hash
        const sorted = new URLSearchParams(
          [...new URLSearchParams(shareParams).entries()].sort(([a], [b]) =>
            a.localeCompare(b),
          ),
        ).toString();
        const hash = createHash("sha256").update(sorted).digest("hex");
        const url = `/share?${shareParams}`;
        // Fire-and-forget — don't block the response
        void createAdminClient()
          .rpc("track_share_link", { p_hash: hash, p_url: url });
      }
    }

    return NextResponse.json({});
  } catch {
    return NextResponse.json({});
  }
}
