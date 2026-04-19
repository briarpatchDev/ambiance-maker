"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AmbianceManager from "@/app/components/Ambiance Manager/ambianceManager";
import ExpectedError from "@/app/components/Errors/Expected Error/errorExpected";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";

export default function PublishedContent({
  ambiances,
}: {
  ambiances: AmbianceData[] | null;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-fetch server data on mount to clear stale Router Cache
  useEffect(() => {
    router.refresh();
  }, [router]);

  return ambiances ? (
    <div className={styles.published} ref={containerRef}>
      <div className={styles.manager_wrapper}>
        <AmbianceManager
          itemsArr={ambiances}
          containerRef={containerRef}
          headlineText="Published Ambiances"
          itemType="published"
        />
      </div>
    </div>
  ) : (
    <div className={styles.not_found}>
      <ExpectedError
        errorMessage="Something went wrong getting your ambiances."
        buttonText="Try Again"
        reset={() => router.refresh()}
      />
    </div>
  );
}
