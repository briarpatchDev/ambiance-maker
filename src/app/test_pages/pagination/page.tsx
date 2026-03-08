"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { VideoData } from "@/app/components/Ambiance Player/ambiancePlayer";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import Pagination from "@/app/components/Pagination/pagination";
import { useRef } from "react";

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

const ambianceData1: AmbianceData = {
  id: "m5_Am93m5nu",
  title: "Fireplace Ambiance",
  author: "shawn73",
  views: 543,
  ratingTotal: 5496,
  ratingCount: 54,
  datePublished: new Date("2026-02-21T10:00:00Z"),
  description:
    "This is a really good description for an ambiance. There's a clock ticking, a fire spitting, rain on the windows, and the gentle hum of an old 'puter. There's a lot more you could say about this, there really is. This is a really good description for an ambiance. There's a clock ticking, a fire spitting, rain on the windows, and the gentle hum of an old 'puter.",
  thumbnail: `https://img.youtube.com/vi/lBq7IZ7tZR8/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData2: AmbianceData = {
  id: "aGOITREm5493",
  title: "This Title is Way Too Long and That's the Point Dontcha Know It?",
  author: "Leonard",
  views: 7954,
  ratingTotal: 44964,
  ratingCount: 545,
  datePublished: new Date("2025-12-15T14:30:00Z"),
  description: "That title is just too long",
  thumbnail: `https://img.youtube.com/vi/invalidId/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData3: AmbianceData = {
  id: "mVdG4a5439",
  title: "Clock ticking",
  author: "AmbianceMaker",
  views: 96432,
  ratingTotal: 945431,
  ratingCount: 542911,
  datePublished: new Date("2024-07-04T09:00:00Z"),
  description: "Tick tock tick tock...",
  thumbnail: `https://img.youtube.com/vi/KwGNDJfSmFk/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData4: AmbianceData = {
  id: "ro45AMTREk4",
  title: "Rainy Day",
  author: "sarha20",
  views: 998432,
  ratingTotal: 4532,
  ratingCount: 545,
  datePublished: new Date("2023-11-11T18:45:00Z"),
  description: "This is a kind of somber ambaince",
  thumbnail: `https://img.youtube.com/vi/50lRiQ9NpZo/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData5: AmbianceData = {
  id: "bkelar545m",
  title: "Desert Sounds",
  author: "bob5432",
  views: 32,
  ratingTotal: 532,
  ratingCount: 145,
  datePublished: new Date("2022-03-22T22:10:00Z"),
  description: "Sand blowing and stufff",
  thumbnail: `https://img.youtube.com/vi/PTTlZ1iX3Ho/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData6: AmbianceData = {
  id: "yTMTRE53lEk4",
  title: "Just Waves",
  author: "AmbianceMaker",
  views: 452,
  ratingTotal: 42,
  ratingCount: 12,
  datePublished: new Date("2026-01-01T00:00:00Z"),
  description: "Just some waves at the beach",
  thumbnail: `https://img.youtube.com/vi/CrYntcx3e0s/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData7: AmbianceData = {
  id: "4_1m5x87kTEt",
  title: "Train Passing By",
  author: "Larna",
  views: 3432,
  ratingTotal: 45,
  ratingCount: 10,
  datePublished: new Date("2025-05-05T12:00:00Z"),
  description:
    "A freight train is passing by on a cool summer night. You can practically hear that description.",
  thumbnail: `https://img.youtube.com/vi/wEBWwUaomDE/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData8: AmbianceData = {
  id: "QWERTy654iop",
  title: "City Walk",
  author: "Tarboon",
  views: 31,
  ratingTotal: 21,
  ratingCount: 4,
  datePublished: new Date("2024-09-30T16:20:00Z"),
  description:
    "The thrilling sights and sounds of downtown NYC are something that could never be experienced from afar... until now. ",
  thumbnail: `https://img.youtube.com/vi/Lg8ixzcIgOs/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData9: AmbianceData = {
  id: "ro45AMTREk4",
  title: "Cozy Paris Coffee Shop Ambience",
  author: "pierre",
  views: 34562,
  ratingTotal: 1235,
  ratingCount: 260,
  datePublished: new Date("2023-02-14T08:00:00Z"),
  description:
    "Settle into a cozy Paris coffee shop filled with gentle café murmur as rain falls outside the windows. This 3-hour ambience features softly muffled background chatter and realistic rainfall, designed to feel natural, unobtrusive, and perfect for focus or relaxation.",
  thumbnail: `https://img.youtube.com/vi/snf28MgXgUU/mqdefault.jpg`,
  videoData: videoData,
};

const ambianceData10: AmbianceData = {
  id: "ro45AMTREk4",
  title: "80s Radio Rewind",
  author: "80skid",
  views: 1980,
  ratingTotal: 888,
  ratingCount: 222,
  datePublished: new Date("2022-08-19T19:30:00Z"),
  description: "Time warp back to the 80s with these retro radio tunes.",
  thumbnail: `https://img.youtube.com/vi/wNZ5p4KHotU/mqdefault.jpg`,
  videoData: videoData,
};

const ambiances = [
  ambianceData1,
  ambianceData2,
  ambianceData3,
  ambianceData4,
  ambianceData5,
  ambianceData6,
  ambianceData7,
  ambianceData8,
  ambianceData9,
  ambianceData10,
];

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.page} ref={containerRef}>
      <div className={styles.wrapper}>
        <Pagination
          collection="default"
          title="Winter Cabin"
          containerRef={containerRef}
        />
      </div>
    </div>
  );
}
