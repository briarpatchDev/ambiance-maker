import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import Player from "@/app/components/Ambiance Player/ambiancePlayer";
import AmbiancePlayer from "@/app/components/Ambiance Player/ambiancePlayer";

export const metadata: Metadata = {
  title: "Ambiance",
  description: `Test page for playing ambiances`,
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <AmbiancePlayer />
      </div>
    </div>
  );
}
