"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import { VideoData } from "@/app/components/Ambiance Player/ambiancePlayer";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";

const videoData: VideoData[] = [
  {
    src: `https://www.youtube.com/embed/eSNqzTwHiuU`,
    startTime: 120,
    endTime: 160,
    volume: 50,
  }, // Old IBM computer sounds
  {
    src: `https://www.youtube.com/watch?v=50lRiQ9NpZo`, // Rain on an old window
    startTime: 24,
    endTime: 56,
    volume: 25,
  },
  {
    src: `https://www.youtube.com/shorts/lBq7IZ7tZR8`, // a short of a fireplace crackling
  },
  {
    src: `https://www.youtube.com/watch?v=KwGNDJfSmFk`,
    playbackSpeed: 2,
    startTime: 6,
    endTime: 18,
  }, // Echoing Clock Tick,
  {
    src: `https://www.youtube.com/watch?v=aG7Ig-HbyVk`, // A video that cannot be imbedded
  },
  {
    src: `https://www.youtube.com/watch?v=invalidVid`, // a 404
  },
];

const ambianceData: AmbianceData = {
  title: "Relaxing Sounds",
  author: "robert73",
  description:
    "This is a really good description for an ambiance. There's a clock ticking, a fire spitting, rain on the windows, and the gentle hum of an old 'puter. There's a lot more you could say about this, there really is. This is a really good description for an ambiance. There's a clock ticking, a fire spitting, rain on the windows, and the gentle hum of an old 'puter.",
  videoData: videoData,
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <AmbianceMaker ambianceData={ambianceData} />
      </div>
    </div>
  );
}
