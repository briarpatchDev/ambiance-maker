"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import VolumeSlider from "@/app/components/Sliders/Volume Slider/volumeSlider";

export default function Page() {
  const [volume, setVolume] = useState(``);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <VolumeSlider onValueChange={(value) => setVolume(value)} />
      </div>
      {volume}
    </div>
  );
}
