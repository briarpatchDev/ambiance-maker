"use client";
import styles from "./page.module.css";
import ViewReports from "@/app/components/Admin/View Reports/viewReports";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <ViewReports />
      </div>
    </div>
  );
}
