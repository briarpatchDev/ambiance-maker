"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import VideoRangeSlider from "@/app/components/Sliders/Video Range Slider/videoRangeSlider";

const videoDuration = 7532;
export default function Page() {
  const [timeframe, setTimeframe] = useState({
    start: 0,
    end: videoDuration,
  });

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <VideoRangeSlider
          videoDuration={videoDuration}
          onTimeframeChange={(start, end) =>
            setTimeframe({ start: start, end: end })
          }
          ariaLabel={"Video timeframe slider"}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>{`Start: ${timeframe.start}`}</div>
        <div>{`End: ${timeframe.end}`}</div>
      </div>
    </div>
  );
}
