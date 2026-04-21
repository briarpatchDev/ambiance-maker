"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AmbianceManager from "@/app/components/Ambiance Manager/ambianceManager";
import ExpectedError from "@/app/components/Errors/Expected Error/errorExpected";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import AmbianceManagerNav from "@/app/components/Ambiance Manager Nav/ambianceManagerNav";

export default function DraftsContent({
  drafts,
}: {
  drafts: AmbianceData[] | null;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-fetch server data on mount to clear stale Router Cache
  useEffect(() => {
    router.refresh();
  }, [router]);

  return drafts ? (
    <div className={styles.drafts} ref={containerRef}>
      <AmbianceManagerNav />
      <div className={styles.manager_wrapper}>
        <AmbianceManager
          itemsArr={drafts}
          containerRef={containerRef}
          headlineText="Drafts"
          itemType="draft"
        />
      </div>
    </div>
  ) : (
    <div className={styles.not_found}>
      <AmbianceManagerNav />
      <ExpectedError
        errorMessage="Something went wrong getting your drafts."
        buttonText="Try Again"
        reset={() => router.refresh()}
      />
    </div>
  );
}
