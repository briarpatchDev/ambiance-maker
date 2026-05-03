"use client";
import { useRef, useState, useEffect } from "react";
import SideMenu from "@/app/components/Side Menu/sideMenu";
import styles from "./layout.module.css";

const BREAKPOINT = 580;

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contentRef = useRef<HTMLDivElement>(null);
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
        <div className={styles.page_content} ref={contentRef}>
          {children}
          <div className={styles.gradient_top}></div>
          <div className={styles.gradient_right}></div>
          <div className={styles.gradient_bottom}></div>
        </div>
      )}
    </div>
  );
}
