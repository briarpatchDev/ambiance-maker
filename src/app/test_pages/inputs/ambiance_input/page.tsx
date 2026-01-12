"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import AmbianceInput from "@/app/components/Ambiance Input/ambianceInput";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <AmbianceInput videoTitle="" linkError="Error found" />
        <AmbianceInput videoTitle="Calm waves" videoDuration={56543} />
      </div>
    </div>
  );
}
