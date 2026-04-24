import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { randomString } from "@/app/lib/randomString";
import { cookies } from "next/headers";
import path from "path";
import { promises as fs } from "fs";

export async function GET(req: NextRequest) {
  try {
    const DEFAULT_PAGE_SIZE = 24;
    const DEFAULT_SORT = "newest";
    const searchParams = req.nextUrl.searchParams;
    let collection = searchParams.get("collection") || "default";
    let page = Number(searchParams.get("page")) || 1;
    let sort = searchParams.get("sort") || DEFAULT_SORT;
    //Page size and page size validation
    let pageSize = Number(searchParams.get("page_size")) || DEFAULT_PAGE_SIZE; //Items that will appear on each page
    if (pageSize < 12) {
      pageSize = 12;
    } else if (pageSize > 48) {
      pageSize = 48;
    }

    // Fake database call - will need to replace this
    const filePath = path.join(
      process.cwd(),
      "src/app/test_pages/pagination/ambiances.json",
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    let items = JSON.parse(fileContent);

    //Sorting our items by the "sort" type
    switch (sort) {
      case `popular`:
        items.sort(function (a: { views: number }, b: { views: number }) {
          return b.views - a.views;
        });
        break;
      case `oldest`:
        items.sort(function (
          a: { datePublished: Date },
          b: { datePublished: Date },
        ) {
          return (
            new Date(a.datePublished).getTime() -
            new Date(b.datePublished).getTime()
          );
        });
        break;
      case `best`:
        items = items.filter((item: any) => {
          return item.views > 9999;
        });
        items.sort(function (
          a: { ratingTotal: number; ratingCount: number },
          b: { ratingTotal: number; ratingCount: number },
        ) {
          return b.ratingTotal / b.ratingCount - a.ratingTotal / a.ratingCount;
        });
        break;
      default: // Sorts by newest by default
        items.sort(function (
          a: { datePublished: Date },
          b: { datePublished: Date },
        ) {
          sort = "newest"; // Redefines to "newest" in case of bad param
          return (
            new Date(b.datePublished).getTime() -
            new Date(a.datePublished).getTime()
          );
        });
    }
    const numPages = Math.ceil(items.length / pageSize);
    //Setting page to be a valid number between 1 and numPages
    if (page > numPages) {
      page = numPages;
    } else if (page < 1) {
      page = 1;
    }

    const returnedItems = items.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize,
    );
    const response = {
      items: returnedItems,
      page: page,
      numPages: numPages,
      pageSize: pageSize,
      sort: sort,
    };

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ errors: "Couldn't complete the request" });
  }
}
