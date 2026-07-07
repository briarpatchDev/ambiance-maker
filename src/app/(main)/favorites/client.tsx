"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import FavoritesManager from "@/app/components/Favorites Manager/favoritesManager";
import ExpectedError from "@/app/components/Errors/Expected Error/errorExpected";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";

export default function FavoritesContent({
  favorites,
}: {
  favorites: AmbianceData[] | null;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-fetch server data on mount to clear stale Router Cache
  useEffect(() => {
    router.refresh();
  }, [router]);

  return favorites ? (
    <div className={styles.favorites} ref={containerRef}>
      <div className={styles.manager_wrapper}>
        <FavoritesManager itemsArr={favorites} containerRef={containerRef} />
      </div>
    </div>
  ) : (
    <div className={styles.favorites}>
      <div className={styles.error_wrapper}>
        <ExpectedError
          errorMessage="Something went wrong getting your favorites."
          buttonText="Try Again"
          reset={() => router.refresh()}
        />
      </div>
    </div>
  );
}
