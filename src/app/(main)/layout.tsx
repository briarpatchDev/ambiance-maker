"use client";
import { useRef, useCallback } from "react";
import SideMenu from "@/app/components/Side Menu/sideMenu";
import styles from "./layout.module.css";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSideMenuWheel = useCallback((e: React.WheelEvent) => {
    contentRef.current?.scrollBy(0, e.deltaY);
  }, []);

  return (
    <div className={styles.page}>
      <div onWheel={handleSideMenuWheel}>
        <SideMenu />
      </div>
      <div ref={contentRef} className={styles.content_wrapper}>
        <div className={styles.page_content}>{children}</div>
      </div>
    </div>
  );
}
