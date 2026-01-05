"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import { useState } from "react";
import SpeedSlider from "@/app/components/Sliders/Speed Slider/speedSlider";

export default function Page() {
  const [speed, setSpeed] = useState(``);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <SpeedSlider onValueChange={(value) => setSpeed(value)} />
      </div>
      {speed}
    </div>
  );
}
