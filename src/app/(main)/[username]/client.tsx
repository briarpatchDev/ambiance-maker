"use client";
import Pagination from "@/app/components/Pagination/pagination";
import styles from "./page.module.css";
import { useRef } from "react";

export default function UsernameClient({ username }: { username: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className={styles.user_page} ref={containerRef}>
      <div className={styles.pagination_wrapper}>
        <Pagination
          title={username}
          collection={`user_${username}`}
          containerRef={containerRef}
        />
      </div>
    </div>
  );
}
