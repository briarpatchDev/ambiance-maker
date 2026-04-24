import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";

const AMBIANCE_SELECT_FIELDS =
  "id, title, description, thumbnail, views, published_at, rating_count, rating_score";

export async function GET(req: NextRequest) {
  try {
    const DEFAULT_PAGE_SIZE = 24;
    const DEFAULT_SORT = "newest";
    const searchParams = req.nextUrl.searchParams;
    const collection = searchParams.get("collection") || "";
    let page = Number(searchParams.get("page")) || 1;
    if (page < 1 || isNaN(page)) page = 1;
    let sort = searchParams.get("sort") || DEFAULT_SORT;

    // Clamp page size between 12 and 48
    let pageSize = Number(searchParams.get("page_size")) || DEFAULT_PAGE_SIZE;
    if (pageSize < 12) pageSize = 12;
    else if (pageSize > 48) pageSize = 48;

    // Validate sort param
    const validSorts = ["newest", "oldest", "popular", "best"];
    if (!validSorts.includes(sort)) sort = DEFAULT_SORT;

    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = null;

    if (collection.startsWith("user_")) {
      // --- User collection ---
      const username = collection.slice(5); // strip "user_" prefix

      // Look up user_id by username (server-only, never sent to client)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

      if (userError || !userData) {
        return NextResponse.json({ errors: "User not found" }, { status: 404 });
      }

      query = supabase
        .from("ambiances")
        .select(AMBIANCE_SELECT_FIELDS, { count: "exact" })
        .eq("user_id", userData.id)
        .eq("status", "published");
    } else {
      // --- Category collection ---
      const categoryId = Number(collection);
      if (!collection || isNaN(categoryId)) {
        return NextResponse.json(
          { errors: "Invalid collection" },
          { status: 400 },
        );
      }

      query = supabase
        .from("ambiances")
        .select(`${AMBIANCE_SELECT_FIELDS}, users(username)`, {
          count: "exact",
        })
        .eq("category_id", categoryId)
        .eq("status", "published");
    }

    // Apply sort
    switch (sort) {
      case "popular":
        query = query.order("views", { ascending: false });
        break;
      case "oldest":
        query = query.order("published_at", { ascending: true });
        break;
      case "best":
        // Bayesian score (rating_score), minimum 50 ratings required
        query = query
          .gte("rating_count", 50)
          .order("rating_score", { ascending: false });
        break;
      default: // newest
        query = query.order("published_at", { ascending: false });
    }

    // Get total count first (HEAD request — no rows transferred) so we can
    // clamp the page before fetching, mirroring the original single-pass logic.
    const { count: totalCount, error: countError } = await query.select(
      undefined,
      { count: "exact", head: true },
    );

    if (countError) {
      console.error("Pagination count error:", countError);
      return NextResponse.json(
        { errors: "Couldn't complete the request" },
        { status: 500 },
      );
    }

    const count = totalCount ?? 0;
    const numPages = Math.max(Math.ceil(count / pageSize), 1);

    // Clamp page exactly as the original did, before fetching
    if (page > numPages) page = numPages;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await query.range(from, to);

    if (error) {
      console.error("Pagination query error:", error);
      return NextResponse.json(
        { errors: "Couldn't complete the request" },
        { status: 500 },
      );
    }

    // Remap DB field names to the shape AmbianceCard expects
    const items = (data ?? []).map((item: any) => {
      const { published_at, rating_score, users, ...rest } = item;
      return {
        ...rest,
        datePublished: published_at,
        ratingTotal: rating_score,
        ...(users ? { author: users.username } : {}),
      };
    });

    return NextResponse.json({
      items,
      page,
      numPages,
      pageSize,
      sort,
      total: count,
    });
  } catch (err) {
    console.error("Pagination route error:", err);
    return NextResponse.json(
      { errors: "Couldn't complete the request" },
      { status: 500 },
    );
  }
}
