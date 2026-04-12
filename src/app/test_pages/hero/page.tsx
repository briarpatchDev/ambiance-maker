"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import Hero from "@/app/components/Hero/hero";
import SideMenu from "@/app/components/Side Menu/sideMenu";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";

export default function Page() {
  return (
    <div className={styles.page}>
      <SideMenu />
      <div className={styles.wrapper}>
        <Hero />
        <AmbianceMaker mode="create" />
      </div>
    </div>
  );
}
