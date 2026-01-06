"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./videoRangeSlider.module.css";
import classNames from "classnames";

// Creates a range slider for a video
interface VideoRangeSliderProps {
  videoDuration: number;
  onTimeframeChange: (start: number, end: number) => void;
  ariaLabel: string;
  style?: React.CSSProperties;
}

export default function VideoRangeSlider({
  videoDuration,
  onTimeframeChange,
  ariaLabel,
  style,
}: VideoRangeSliderProps) {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(videoDuration);
  const [fillWidth, setFillWidth] = useState(100);
  const [fillStart, setFillStart] = useState(0);

  const startThumbRef = useRef<null | HTMLDivElement>(null);
  const endThumbRef = useRef<null | HTMLDivElement>(null);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const isDragging = useRef(false);
  const trackRef = useRef<null | HTMLDivElement>(null);

  // When the timeframe changes, changes the fill and calls a parent function
  useEffect(() => {
    setFillStart((100 * start) / videoDuration);
    setFillWidth((100 * (end - start)) / videoDuration);
    onTimeframeChange(start, end);
  }, [start, end]);

  // Handles dragging the start thumb
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingStart || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const newPoint = Math.round(
        videoDuration *
          Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      );

      if (newPoint < end) {
        setStart(newPoint);
      } else {
        setStart(end - 1);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingStart(false);
      // Done to stop click event
      setTimeout(() => {
        isDragging.current = false;
      }, 10);
    };
    if (isDraggingStart) {
      isDragging.current = true;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingStart]);

  // Handles dragging the end thumb
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingEnd || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const newPoint = Math.round(
        videoDuration *
          Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      );
      if (newPoint > start) {
        setEnd(newPoint);
      } else {
        setEnd(start + 1);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingEnd(false);
      // Done to stop click event
      setTimeout(() => {
        isDragging.current = false;
      }, 10);
    };
    if (isDraggingEnd) {
      isDragging.current = true;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingEnd]);

  // Start dragging when user mouses down on the start thumb
  function handleMouseDownStart(e: React.MouseEvent) {
    e.preventDefault();
    startThumbRef.current?.focus();
    setIsDraggingStart(true);
  }

  // Start dragging when user mouses down on the end thumb
  function handleMouseDownEnd(e: React.MouseEvent) {
    e.preventDefault();
    endThumbRef.current?.focus();
    setIsDraggingEnd(true);
  }

  // Moves the start thumb when user presses on arrow keys
  function handleKeydownStart(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      if (start + 1 < end) {
        setStart(start + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (start - 1 >= 0) {
        setStart(start - 1);
      }
    }
  }

  // Moves the end thumb when user presses on arrow keys
  function handleKeydownEnd(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      if (end + 1 <= videoDuration) {
        setEnd(end + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (end - 1 > start) {
        setEnd(end - 1);
      }
    }
  }

  // Moves the closest thumb when user clicks on the track
  function handleClick(e: React.MouseEvent) {
    if (isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newPoint = Math.round(
      videoDuration *
        Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    );
    let thumb: "start" | "end" = "start";
    if (newPoint < start) {
    } else if (newPoint > end) {
      thumb = "end";
    } else {
      thumb =
        Math.abs(start - newPoint) > Math.abs(end - newPoint) ? "end" : "start";
    }
    if (thumb === "start") {
      setStart(newPoint);
      startThumbRef.current?.focus();
    } else {
      setEnd(newPoint);
      endThumbRef.current?.focus();
    }
  }

  // Converts videoDuration to a timecode in HH:MM:SS
  function convertToTimecode(videoDuration: number) {
    let seconds = (videoDuration % 60).toString();
    let minutes = (Math.floor(videoDuration / 60) % 60).toString();
    while (seconds.length < 2) {
      seconds = `0` + seconds;
    }
    while (minutes.toString().length < 2) {
      minutes = `0` + minutes;
    }
    let timecode = `${minutes}:${seconds}`;
    if (videoDuration >= 3600) {
      let hours = Math.floor(videoDuration / 3600).toString();
      timecode = `${hours}:${timecode}`;
    }
    return timecode;
  }

  return (
    <div
      style={{ ...style }}
      className={styles.track}
      onClick={handleClick}
      ref={trackRef}
    >
      <div
        className={classNames(styles.fill, {
          [styles.dragging]: isDraggingStart || isDraggingEnd,
        })}
        style={{ width: `${fillWidth}%`, left: `${fillStart}%` }}
      ></div>
      <div
        className={classNames(styles.thumb, styles.start, {
          [styles.dragging]: isDraggingStart,
        })}
        style={{ left: `${fillStart}%` }}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        onKeyDown={handleKeydownStart}
        onMouseDown={handleMouseDownStart}
        aria-valuemin={0}
        aria-valuemax={end - 1}
        aria-valuenow={start}
        aria-valuetext={start.toString()}
        ref={startThumbRef}
      >
        <label className={styles.thumb_label}>
          <div className={styles.text_wrapper}>{convertToTimecode(start)}</div>
        </label>
      </div>
      <div
        className={classNames(styles.thumb, styles.end, {
          [styles.dragging]: isDraggingEnd,
        })}
        style={{ left: `${fillStart + fillWidth}%` }}
        role="slider"
        tabIndex={0}
        aria-valuemin={start + 1}
        aria-valuemax={videoDuration}
        aria-valuenow={end}
        aria-valuetext={end.toString()}
        aria-label={ariaLabel}
        onKeyDown={handleKeydownEnd}
        onMouseDown={handleMouseDownEnd}
        ref={endThumbRef}
      >
        <label className={styles.thumb_label}>
          <div className={styles.text_wrapper}>{convertToTimecode(end)}</div>
        </label>
      </div>
    </div>
  );
}
