"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import SubmitAmbiance from "@/app/components/Submit Ambiance/submitAmbiance";
import { VideoData } from "@/app/components/Ambiance Maker/ambianceMaker";
import Modal from "@/app/components/Modals/Modal Versatile Portal/modal";

const username = "CleverMonk149";
const id = "5ARp542_m25daq";
const title = "Relaxing Room";
const description =
  "This is a really good ambiance. There's rain on the window, a fireplace, an echoing clock and the gentle hum of an old computer.";
const videoData: VideoData[] = [
  {
    title: "Old Computer Sounds",
    src: `https://www.youtube.com/embed/eSNqzTwHiuU`,
    startTime: 120,
    endTime: 160,
    volume: 50,
    playbackSpeed: 1.0,
  }, // Old IBM computer sounds
  {
    title: "Rainy Day",
    src: `https://www.youtube.com/watch?v=50lRiQ9NpZo`, // Rain on an old window
    startTime: 24,
    endTime: 56,
    volume: 25,
    playbackSpeed: 1.0,
  },
  {
    title: "Fireplace",
    src: `https://www.youtube.com/shorts/lBq7IZ7tZR8`, // a short of a fireplace crackling
    startTime: 0,
    endTime: 24,
    volume: 100,
    playbackSpeed: 1.25,
  },
  {
    title: "Tick tock tick tock",
    src: `https://www.youtube.com/watch?v=KwGNDJfSmFk`,
    startTime: 6,
    endTime: 18,
    volume: 100,
    playbackSpeed: 0.6,
  }, // Echoing Clock Tick,
  {
    src: `https://www.youtube.com/watch?v=aG7Ig-HbyVk`, // A video that cannot be imbedded
  },
  {
    src: `https://www.youtube.com/watch?v=invalidVid`, // a 404
  },
];

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
          <SubmitAmbiance
            username={username}
            id={id}
            title={title}
            description={description}
            videoData={videoData}
            closeFunction={() => {}}
          />
      </div>
    </div>
  );
}
