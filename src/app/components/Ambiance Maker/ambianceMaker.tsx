"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ambianceMaker.module.css";
import classNames from "classnames";
import AmbianceInput from "@/app/components/Ambiance Input/ambianceInput";
import AmbiancePlayer from "@/app/components/Ambiance Player/ambiancePlayer";
import Button from "@/app/components/Buttons/Button Set/button";
import { updateObjectArr } from "@/app/lib/setStateFunctions";

interface AmbianceMakerProps {
  ambianceData?: AmbianceData;
  user?: any;
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
export const createVideoEntry = (): VideoData => ({
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
  user,
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

  // Takes video data and creates a sharable link out of it
  const shareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [shareButtonText, setShareButtonText] = useState("Copy Ambiance Link");
  async function shareLink() {
    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
    }
    let text = `localhost:3000/test_pages/share?`;
    let ampersand = false;
    videoData.forEach((video, index) => {
      const match =
        video.src?.match(
          /(?:https?:\/\/)?(?:[\w-]+\.)*youtube\.com\/watch\?v=([\w-]+)/i,
        ) ||
        video.src?.match(
          /(?:https?:\/\/)?(?:[\w-]+\.)*youtube\.com\/shorts\/([\w-]+)/i,
        ) ||
        video.src?.match(
          /(?:https?:\/\/)?(?:[\w-]+\.)*youtube\.com\/embed\/([\w-]+)/i,
        ) ||
        null;
      if (!match) return;
      const videoId = match[1];
      text += `${ampersand ? `&` : ``}v${index + 1}=s${video.startTime}e${video.endTime}v${video.volume}r${Math.round(Number(video.playbackSpeed) * 100)}id${videoId}`;
      ampersand = true;
    });
    async function writeClipboardItem(text: string) {
      try {
        const clipboardItem = new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
        });
        await navigator.clipboard.write([clipboardItem]);
      } catch (err) {}
    }
    await writeClipboardItem(text);
    setShareButtonText("Link copied!");
    shareTimeoutRef.current = setTimeout(() => {
      setShareButtonText("Copy Ambiance Link");
    }, 1600);
  }

  // Saves an ambiance for a logged in user
  function saveAmbiance() {}

  // Saves the ambiance and submits it to the site for possible publication
  function submitAmbiance() {}

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
      {!ambianceData?.description &&
        videoData.filter((video) => {
          return video.title;
        }).length > 1 && (
          <div className={styles.share}>
            <Button
              variant="primary"
              onClick={shareLink}
              style={{ maxWidth: "40%", flex: "1" }}
            >
              {shareButtonText}
            </Button>
            {user && (
              <Button
                variant="primary"
                onClick={saveAmbiance}
              >{`Save Ambiance`}</Button>
            )}
            {user && (
              <Button
                variant="primary"
                onClick={submitAmbiance}
              >{`Submit Ambiance`}</Button>
            )}
          </div>
        )}
      {ambianceData?.description && (
        <div className={styles.description_wrapper}>
          <div className={styles.description}>{ambianceData.description}</div>
        </div>
      )}
    </div>
  );
}
