"use client";
import { useEffect, useState } from "react";
import SideMenu from "@/app/components/Side Menu/sideMenu";
import NotFound from "@/app/components/Errors/Not Found/notFound";
import styles from "./not-found.module.css";

const BREAKPOINT = 580;

export default function NotFoundClient() {
  const [expandMenu, setExpandMenu] = useState<boolean | null>(null);

  useEffect(() => {
    if (window.innerWidth < BREAKPOINT) {
      setExpandMenu(false);
    } else {
      setExpandMenu(window.localStorage.getItem("menuExpanded") !== "false");
    }
  }, []);

  return (
    <div className={styles.page}>
      {expandMenu !== null && <SideMenu defaultExpanded={expandMenu} />}
      {expandMenu !== null && (
        <div className={styles.page_content}>
          <div className={styles.not_found}>
            <NotFound
              errorMessage="The sound doesn't reach this far..."
              buttonText="Return Home"
              href="/"
            />
          </div>
          <div className={styles.gradient_top} />
          <div className={styles.gradient_right} />
          <div className={styles.gradient_bottom} />
        </div>
      )}
    </div>
  );
}
