"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ambianceInput.module.css";
import classNames from "classnames";
import VideoSlider from "@/app/components/Sliders/Video Range Slider/videoRangeSlider";
import VolumeSlider from "@/app/components/Sliders/Volume Slider/volumeSlider";
import SpeedSlider from "@/app/components/Sliders/Speed Slider/speedSlider";
import { debounce } from "lodash";

interface AmbianceInputProps {
  videoTitle: string | undefined;
  videoDuration: number | undefined;
  startTime?: number;
  endTime?: number;
  currentTime?: number;
  volume?: number;
  playbackSpeed?: number;
  linkError: string | undefined;
  onLinkChange: (link: string, index?: number) => void;
  onVolumeChange: (volume: string, index?: number) => void;
  onSpeedChange: (speed: string, index?: number) => void;
  onTimeframeChange: (start: number, end: number, index?: number) => void;
  videoIndex?: number;
  isIos?: boolean;
  initialLink?: string;
  style?: React.CSSProperties;
}

export default function AmbianceInput({
  videoTitle,
  videoDuration,
  startTime,
  endTime,
  currentTime,
  volume,
  playbackSpeed,
  linkError,
  onLinkChange,
  onVolumeChange,
  onSpeedChange,
  onTimeframeChange,
  videoIndex,
  isIos,
  initialLink,
  style,
}: AmbianceInputProps) {
  const linkInputRef = useRef<HTMLInputElement | null>(null);
  const [inputData, setInputData] = useState({
    link: initialLink ? initialLink : "",
  });
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // Updates the link input field
  const handleLinkChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    handleChange(e);
  };

  // Uses onLinkChange to show a video once user stops typing
  const validateLink = useCallback(
    debounce((link: string) => {
      onLinkChange(link, videoIndex);
    }, 300),
    [],
  );

  useEffect(() => {
    validateLink(inputData.link);
  }, [inputData.link]);

  return (
    <div style={{ ...style }} className={styles.ambiance_input}>
      {!!videoTitle && <h1>{videoTitle}</h1>}
      <div className={styles.link_input_wrapper}>
        <input
          id={"link"}
          name={"link"}
          type={"text"}
          value={inputData.link}
          maxLength={64}
          onChange={handleLinkChange}
          ref={linkInputRef}
          aria-describedby={"link_error"}
          placeholder="Enter a Youtube link..."
          className={styles.link_input}
        />
        {!!linkError && (
          <div className={styles.link_error} id="link_error" aria-live="polite">
            <div>{`❌`}</div>
            <div>{linkError}</div>
          </div>
        )}
      </div>
      {!!videoDuration && (
        <div className={styles.video_controls_wrapper}>
          <div className={styles.video_controls}>
            <VideoSlider
              startTime={startTime}
              endTime={endTime}
              currentTime={currentTime}
              onTimeframeChange={onTimeframeChange}
              ariaLabel="Video timeframe slider"
              videoDuration={videoDuration}
              videoIndex={videoIndex}
            />
          </div>
          <div className={styles.video_controls}>
            {!isIos && (
              <VolumeSlider
                currentVolume={volume}
                onValueChange={onVolumeChange}
                videoIndex={videoIndex}
              />
            )}
            <SpeedSlider
              playbackSpeed={playbackSpeed}
              onValueChange={onSpeedChange}
              videoIndex={videoIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
}
