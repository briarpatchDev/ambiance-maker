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
  ambianceData?: AmbianceData;
  style?: React.CSSProperties;
}

export interface VideoData {
  src?: string;
  linkError?: string;
  title?: string;
  duration?: number;
  startTime?: number;
  endTime?: number;
  currentTime?: number;
  volume?: number;
  playbackSpeed?: number;
}

export interface AmbianceData {
  title?: string;
  author?: string;
  description?: string;
  videoData: VideoData[];
}

const maxVideos = 6;
const createVideoEntry = (): VideoData => ({
  src: undefined,
  linkError: undefined,
  title: undefined,
  duration: undefined,
  startTime: undefined,
  endTime: undefined,
  currentTime: undefined,
  volume: undefined,
  playbackSpeed: undefined,
});

export default function AmbianceMaker({
  ambianceData,
  style,
}: AmbianceMakerProps) {
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
    Array.from({ length: maxVideos }, createVideoEntry),
  );

  return (
    <div style={{ ...style }} className={styles.ambiance_maker}>
      {ambianceData?.title && (
        <div className={styles.header_wrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>{ambianceData.title}</h1>
            {ambianceData.author && (
              <div className={styles.author_wrapper}>
                <div className={styles.by}>{`by`}</div>
                <div className={styles.author}>{ambianceData.author}</div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.player_wrapper}>
        <AmbiancePlayer
          videoData={videoData}
          initialVideoData={ambianceData?.videoData}
          setVideoData={setVideoData}
        />
      </div>
      <div className={styles.inputs_wrapper}>
        {videoData.map((video, videoIndex) => {
          return (
            <AmbianceInput
              videoTitle={video.title}
              videoDuration={video.duration}
              startTime={video.startTime}
              endTime={video.endTime}
              currentTime={video.currentTime}
              volume={video.volume}
              playbackSpeed={video.playbackSpeed}
              linkError={video.linkError}
              onLinkChange={onLinkChange}
              onTimeframeChange={onTimeframeChange}
              onVolumeChange={onVolumeChange}
              onSpeedChange={onSpeedChange}
              videoIndex={videoIndex}
              initialLink={
                ambianceData && ambianceData.videoData[videoIndex]
                  ? ambianceData.videoData[videoIndex].src
                  : undefined
              }
              key={`input-${videoIndex}`}
            />
          );
        })}
      </div>
      {ambianceData?.description && (
        <div className={styles.description_wrapper}>
          <div className={styles.description}>{ambianceData.description}</div>
        </div>
      )}
    </div>
  );
}
