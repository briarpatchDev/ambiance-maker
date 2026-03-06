"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { VideoData } from "@/app/components/Ambiance Player/ambiancePlayer";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import ViewSubmitted from "@/app/components/Admin/View Submitted/viewSubmitted";
import { useRef } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.page} ref={containerRef}>
      <div className={styles.wrapper}>
        <ViewSubmitted containerRef={containerRef} />
      </div>
    </div>
  );
}
