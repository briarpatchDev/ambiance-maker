"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <AmbianceMaker />
      </div>
    </div>
  );
}
