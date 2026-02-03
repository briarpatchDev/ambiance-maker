"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./videoRangeSlider.module.css";
import classNames from "classnames";

// Creates a range slider for a video
interface VideoRangeSliderProps {
  videoDuration: number;
  onTimeframeChange: (start: number, end: number, videoIndex?: number) => void;
  ariaLabel: string;
  startTime?: number;
  endTime?: number;
  videoIndex?: number;
  style?: React.CSSProperties;
}

export default function VideoRangeSlider({
  videoDuration,
  onTimeframeChange,
  ariaLabel,
  startTime,
  endTime,
  videoIndex,
  style,
}: VideoRangeSliderProps) {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(videoDuration);
  const [fillWidth, setFillWidth] = useState(100);
  const [fillStart, setFillStart] = useState(0);

  const startThumbRef = useRef<null | HTMLDivElement>(null);
  const endThumbRef = useRef<null | HTMLDivElement>(null);
  const activeThumb = useRef<"start" | "end" | null>(null);
  const trackRef = useRef<null | HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  // When the timeframe changes, changes the fill and calls a parent function
  useEffect(() => {
    setFillStart((100 * start) / videoDuration);
    setFillWidth((100 * (end - start)) / videoDuration);
  }, [start, end]);

  // When the prop timeframe changes, sets the new start / end times
  useEffect(() => {
    setStart(startTime ?? 0);
    setEnd(endTime ?? videoDuration);
  }, [startTime, endTime, videoDuration]);

  // Handles dragging the start thumb
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const newPoint = Math.round(
        videoDuration *
          Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      );
      if (activeThumb.current === "start") {
        const newStart = newPoint < end ? newPoint : end - 1;
        setStart(newStart);
        onTimeframeChange(newStart, end, videoIndex);
      } else {
        const newEnd = newPoint > start ? newPoint : start + 1;
        setEnd(newEnd);
        onTimeframeChange(start, newEnd, videoIndex);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !trackRef.current) return;
      e.preventDefault();
      const rect = trackRef.current.getBoundingClientRect();
      const newPoint = Math.round(
        videoDuration *
          Math.max(
            0,
            Math.min(1, (e.touches[0].clientX - rect.left) / rect.width),
          ),
      );
      if (activeThumb.current === "start") {
        const newStart = newPoint < end ? newPoint : end - 1;
        setStart(newStart);
        onTimeframeChange(newStart, end, videoIndex);
      } else {
        const newEnd = newPoint > start ? newPoint : start + 1;
        setEnd(newEnd);
        onTimeframeChange(start, newEnd, videoIndex);
      }
    };

    const handleMouseUp = () => {
      setShowTransition(true);
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setShowTransition(true);
      setIsDragging(false);
    };

    if (isDragging) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowTransition(false);
      }, 200);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  // Moves the start thumb when user presses on arrow keys
  function handleKeydownStart(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      if (start + 1 < end) {
        setStart(start + 1);
        onTimeframeChange(start + 1, end, videoIndex);
      }
    } else if (e.key === "ArrowLeft") {
      if (start - 1 >= 0) {
        setStart(start - 1);
        onTimeframeChange(start - 1, end, videoIndex);
      }
    }
  }

  // Moves the end thumb when user presses on arrow keys
  function handleKeydownEnd(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      if (end + 1 <= videoDuration) {
        setEnd(end + 1);
        onTimeframeChange(start, end + 1, videoIndex);
      }
    } else if (e.key === "ArrowLeft") {
      if (end - 1 > start) {
        setEnd(end - 1);
        onTimeframeChange(start, end - 1, videoIndex);
      }
    }
  }

  // Moves the closest thumb when user clicks or touches on the track
  function handleDragStart(clientX: number, track: HTMLElement) {
    if (isDragging) return;
    const rect = track.getBoundingClientRect();
    const newPoint = Math.round(
      videoDuration *
        Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
    );
    let thumb: "start" | "end" = "start";
    if (newPoint < start) {
    } else if (newPoint > end) {
      thumb = "end";
    } else {
      thumb =
        Math.abs(start - newPoint) > Math.abs(end - newPoint) ? "end" : "start";
    }
    activeThumb.current = thumb;
    if (thumb === "start") {
      setStart(newPoint);
      onTimeframeChange(newPoint, end, videoIndex);
      setTimeout(() => {
        startThumbRef.current?.focus();
      }, 0);
    } else {
      setEnd(newPoint);
      onTimeframeChange(start, newPoint, videoIndex);
      setTimeout(() => {
        endThumbRef.current?.focus();
      }, 0);
    }
    setIsDragging(true);
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

  // Moves the closet thumb when user presses down on the track
  function handleMouseDown(e: React.MouseEvent) {
    handleDragStart(e.clientX, e.currentTarget as HTMLElement);
  }

  // Moves the closest thumb when user touches the track
  function handleTouchStart(e: React.TouchEvent) {
    e.preventDefault();
    handleDragStart(e.touches[0].clientX, e.currentTarget as HTMLElement);
  }

  return (
    <div
      style={{ ...style }}
      className={styles.track}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      ref={trackRef}
    >
      <div
        className={classNames(styles.fill, {
          [styles.transition]: showTransition,
        })}
        style={{ width: `${fillWidth}%`, left: `${fillStart}%` }}
      ></div>
      <div
        className={classNames(styles.thumb, styles.start, {
          [styles.transition]: showTransition,
        })}
        style={{ left: `${fillStart}%` }}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        onKeyDown={handleKeydownStart}
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
          [styles.transition]: showTransition,
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
        ref={endThumbRef}
      >
        <label className={styles.thumb_label}>
          <div className={styles.text_wrapper}>{convertToTimecode(end)}</div>
        </label>
      </div>
    </div>
  );
}
