"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import AmbianceInput from "@/app/components/Ambiance Input/ambianceInput";

export default function Page() {
  function onLinkChange(link: string) {}

  function onTimeframeChange(start: number, end: number) {}

  function onVolumeChange(volume: string) {}

  function onSpeedChange(speed: string) {}

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <AmbianceInput
          videoTitle={undefined}
          linkError="This video cannot be embedded"
          videoDuration={undefined}
          onLinkChange={onLinkChange}
          onTimeframeChange={onTimeframeChange}
          onVolumeChange={onVolumeChange}
          onSpeedChange={onSpeedChange}
        />
        <AmbianceInput
          videoTitle="Calm waves"
          linkError={undefined}
          videoDuration={56543}
          onLinkChange={onLinkChange}
          onTimeframeChange={onTimeframeChange}
          onVolumeChange={onVolumeChange}
          onSpeedChange={onSpeedChange}
        />
      </div>
    </div>
  );
}
