import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";

const VALID_PAGES = ["home", "create", "share"] as const;

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

    return NextResponse.json({});
  } catch {
    return NextResponse.json({});
  }
}
