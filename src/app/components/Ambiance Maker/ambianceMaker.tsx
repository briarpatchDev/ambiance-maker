"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ambianceMaker.module.css";
import classNames from "classnames";
import AmbianceInput from "@/app/components/Ambiance Input/ambianceInput";
import AmbiancePlayer from "@/app/components/Ambiance Player/ambiancePlayer";
import { updateObjectArr } from "@/app/lib/setStateFunctions";

interface AmbianceMakerProps {
  style?: React.CSSProperties;
}

export interface VideoData {
  src?: string;
  linkError?: string;
  title?: string;
  duration?: number;
  startTime?: number;
  endTime?: number;
  volume?: number;
  playbackSpeed?: number;
}

const maxVideos = 1;
const createVideoEntry = (): VideoData => ({
  src: undefined,
  linkError: undefined,
  title: undefined,
  duration: undefined,
  startTime: undefined,
  endTime: undefined,
  volume: undefined,
  playbackSpeed: undefined,
});

export default function AmbianceMaker({ style }: AmbianceMakerProps) {
  function onLinkChange(link: string, index = 0) {
    updateObjectArr(setVideoData, index, { [`src`]: link });
  }

  function onTimeframeChange(start: number, end: number, index = 0) {
    updateObjectArr(setVideoData, index, {
      [`startTime`]: start,
      [`endTime`]: end,
    });
  }

  function onVolumeChange(volume: string, index = 0) {
    updateObjectArr(setVideoData, index, { [`volume`]: parseInt(volume) });
  }

  function onSpeedChange(speed: string, index = 0) {
    updateObjectArr(setVideoData, index, {
      [`playbackSpeed`]: parseFloat(speed),
    });
  }

  const [videoData, setVideoData] = useState<VideoData[]>(
    Array.from({ length: maxVideos }, createVideoEntry)
  );

  return (
    <div style={{ ...style }} className={styles.ambiance_maker}>
      <div className={styles.player_wrapper}>
        <AmbiancePlayer videoData={videoData} setVideoData={setVideoData} />
      </div>
      <div className={styles.inputs_wrapper}>
        {videoData.map((video, videoIndex) => {
          return (
            <AmbianceInput
              videoTitle={video.title}
              videoDuration={video.duration}
              linkError={video.linkError}
              onLinkChange={onLinkChange}
              onTimeframeChange={onTimeframeChange}
              onVolumeChange={onVolumeChange}
              onSpeedChange={onSpeedChange}
              videoIndex={videoIndex}
              key={`input-${videoIndex}`}
            />
          );
        })}
      </div>
    </div>
  );
}
