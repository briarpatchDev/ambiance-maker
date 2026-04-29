"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AmbianceManager from "@/app/components/Ambiance Manager/ambianceManager";
import ExpectedError from "@/app/components/Errors/Expected Error/errorExpected";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import AmbianceManagerNav from "@/app/components/Ambiance Manager Nav/ambianceManagerNav";
import classNames from "classnames";

type SortOption = "newest" | "oldest" | "popular";

export default function PublishedContent() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ambiances, setAmbiances] = useState<AmbianceData[]>([]);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [sort, setSort] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  // Re-fetch server data on mount to clear stale Router Cache
  useEffect(() => {
    router.refresh();
  }, [router]);

  const fetchPage = useCallback(
    async (targetPage: number, targetSort: SortOption) => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/pagination/published?page=${targetPage}&sort=${targetSort}`,
        );
        const data = await res.json();
        if (data.errors) throw new Error(data.errors);
        setAmbiances(
          data.items.map((item: any) => ({
            ...item,
            datePublished: item.datePublished
              ? new Date(item.datePublished)
              : undefined,
          })),
        );
        setPage(data.page);
        setNumPages(data.numPages);
        setSort(data.sort);
        setIsError(false);
      } catch {
        setIsError(true);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchPage(1, "newest");
  }, [fetchPage]);

  function handlePageChange(newPage: number) {
    fetchPage(newPage, sort);
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSortChange(newSort: SortOption) {
    setSort(newSort);
    fetchPage(1, newSort);
  }

  // Pagination nav — only renders when numPages > 1
  function paginationNav() {
    if (numPages <= 1) return null;
    const range = 2;
    let startPage = Math.max(page - range, 1);
    let endPage = Math.min(page + range, numPages);
    if (startPage === 1) endPage = Math.min(1 + 2 * range, numPages);
    if (endPage === numPages) startPage = Math.max(numPages - 2 * range, 1);

    const items: React.ReactNode[] = [];

    if (page > 1) {
      items.push(
        <button
          key="prev"
          className={styles.page_arrow}
          onClick={() => handlePageChange(page - 1)}
          aria-label="Previous page"
        >
          {"<"}
        </button>,
      );
    }
    if (page > 1 + range && numPages > 2 * range + 1) {
      items.push(
        <button
          key="page-1"
          className={styles.page_btn}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>,
      );
      if (startPage > 2) {
        items.push(
          <span key="left-ellipsis" className={styles.ellipsis}>
            ...
          </span>,
        );
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      if (i === page) {
        items.push(
          <span
            key={`page-${i}`}
            className={styles.current_page}
            aria-current="page"
          >
            {i}
          </span>,
        );
      } else {
        items.push(
          <button
            key={`page-${i}`}
            className={styles.page_btn}
            onClick={() => handlePageChange(i)}
            aria-label={`Go to page ${i}`}
          >
            {i}
          </button>,
        );
      }
    }
    if (page < numPages - range && numPages > 2 * range + 1) {
      if (endPage < numPages - 1) {
        items.push(
          <span key="right-ellipsis" className={styles.ellipsis}>
            ...
          </span>,
        );
      }
      items.push(
        <button
          key={`page-${numPages}`}
          className={styles.page_btn}
          onClick={() => handlePageChange(numPages)}
          aria-label={`Go to page ${numPages}`}
        >
          {numPages}
        </button>,
      );
    }
    if (page < numPages) {
      items.push(
        <button
          key="next"
          className={styles.page_arrow}
          onClick={() => handlePageChange(page + 1)}
          aria-label="Next page"
        >
          {">"}
        </button>,
      );
    }

    return (
      <nav className={styles.pagination_nav} aria-label="Pagination">
        {items}
      </nav>
    );
  }

  // Sort menu
  function sortMenu() {
    const options: { label: string; value: SortOption }[] = [
      { label: "Newest", value: "newest" },
      { label: "Oldest", value: "oldest" },
      { label: "Popular", value: "popular" },
    ];
    return (
      <div className={styles.sort_menu} aria-label="Sort options">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={classNames(styles.sort_btn, {
              [styles.sort_active]: sort === opt.value,
            })}
            onClick={() => handleSortChange(opt.value)}
            aria-label={`Sort by ${opt.value}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.published}>
        <AmbianceManagerNav />
        <div className={styles.error_wrapper}>
          <ExpectedError
            errorMessage="Something went wrong getting your ambiances."
            buttonText="Try Again"
            reset={() => fetchPage(page, sort)}
          />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.published} ref={containerRef}>
      <AmbianceManagerNav />
      {isInitialized && (
        <div className={styles.manager_wrapper}>
          <div className={styles.sort_menu_wrapper}>{sortMenu()}</div>
          <AmbianceManager
            itemsArr={ambiances}
            containerRef={containerRef}
            headlineText="Published Ambiances"
            itemType="published"
          />

          {paginationNav()}
        </div>
      )}
    </div>
  );
}
