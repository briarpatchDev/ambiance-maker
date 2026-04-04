import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyAdmin } from "@/app/lib/auth/adminAuth";

// Returns paginated pending reports
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdmin();
    if ("error" in auth) return auth.error;

    const DEFAULT_PAGE_SIZE = 24;
    const DEFAULT_SORT = "oldest";

    const searchParams = req.nextUrl.searchParams;
    let page = Number(searchParams.get("page")) || 1;
    let sort = searchParams.get("sort") || DEFAULT_SORT;

    let pageSize = Number(searchParams.get("page_size")) || DEFAULT_PAGE_SIZE;
    if (pageSize < 12) pageSize = 12;
    else if (pageSize > 48) pageSize = 48;

    const supabase = createAdminClient();

    // Get total count of pending reports
    const { count: totalCount, error: countError } = await supabase
      .from("ambiance_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    if (countError) throw countError;

    const total = totalCount ?? 0;
    const numPages = Math.max(Math.ceil(total / pageSize), 1);

    if (page > numPages) page = numPages;
    if (page < 1) page = 1;

    // Fetch reports with joined ambiance and reporter info
    let query = supabase
      .from("ambiance_reports")
      .select(
        `
        id,
        ambiance_id,
        report_type,
        message,
        created_at,
        ambiances!inner ( title, thumbnail ),
        users!inner ( username )
      `,
      )
      .eq("status", "pending");

    switch (sort) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      default:
        sort = "oldest";
        query = query.order("created_at", { ascending: true });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw error;

    const items = (data || []).map((row: any) => ({
      id: row.id,
      ambianceId: row.ambiance_id,
      ambianceTitle: row.ambiances?.title ?? "Unknown",
      thumbnail: row.ambiances?.thumbnail ?? "",
      reportType: row.report_type,
      message: row.message,
      reporter: row.users?.username ?? "Unknown",
      createdAt: row.created_at,
    }));

    return NextResponse.json({
      items,
      page,
      numPages,
      pageSize,
      sort,
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    return NextResponse.json({ errors: "Couldn't complete the request" });
  }
}
