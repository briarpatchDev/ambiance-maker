"use client";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import styles from "./page.module.css";
import { useUser } from "@/app/contexts/userContext";
import { useEffect } from "react";

export default function Page() {
  const user = useUser();

  useEffect(() => {
    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "create" }),
    }).catch(() => {});
  }, []);

  return (
    <div className={styles.create}>
      <div className={styles.ambiance_maker_wrapper}>
        <AmbianceMaker mode="create" user={user} />
      </div>
    </div>
  );
}
