"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./discreteSlider.module.css";
import classNames from "classnames";

// Creates a slider from an array of values
interface DiscreteSliderProps {
  values: string[];
  defaultValue: string;
  currentValue?: string;
  onValueChange: (value: string, videoIndex?: number) => void;
  ariaLabel: string;
  videoIndex?: number;
  style?: React.CSSProperties;
}

export default function DiscreteSlider({
  values,
  defaultValue,
  currentValue,
  onValueChange,
  ariaLabel,
  videoIndex,
  style,
}: DiscreteSliderProps) {
  const [value, setValue] = useState(defaultValue);
  const index = useRef(values.findIndex((value) => value === defaultValue));
  const [fill, setFill] = useState((100 * index.current) / (values.length - 1));
  const [isDragging, setIsDragging] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  const thumbRef = useRef<null | HTMLDivElement>(null);
  const trackRef = useRef<null | HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  // Uses the currentValue prop to sync the slider
  useEffect(() => {
    if (!currentValue || currentValue === value) return;
    let currentIndex = values.findIndex((value) => value === currentValue);
    let newValue = currentValue;
    if (currentIndex < 0) {
      currentIndex = values.findIndex((value) => value === defaultValue);
      newValue = defaultValue;
    }
    index.current = currentIndex;
    setFill((100 * currentIndex) / (values.length - 1));
    setValue(newValue);
  }, [currentValue]);

  // Handles dragging the thumb
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      const newIndex = Math.round(percentage * (values.length - 1));
      index.current = newIndex;
      setFill((100 * newIndex) / (values.length - 1));
      setValue(values[newIndex]);
      onValueChange(values[newIndex], videoIndex);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !trackRef.current) return;
      e.preventDefault(); // Prevent scrolling
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (e.touches[0].clientX - rect.left) / rect.width),
      );
      const newIndex = Math.round(percentage * (values.length - 1));
      index.current = newIndex;
      setFill((100 * newIndex) / (values.length - 1));
      setValue(values[newIndex]);
      onValueChange(values[newIndex], videoIndex);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setShowTransition(true);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setShowTransition(true);
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

  // Moves the thumb when user presses on arrow keys
  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      if (index.current < values.length - 1) {
        index.current++;
        setFill((100 * index.current) / (values.length - 1));
        setValue(values[index.current]);
        onValueChange(values[index.current], videoIndex);
      }
    } else if (e.key === "ArrowLeft") {
      if (index.current > 0) {
        index.current--;
        setFill((100 * index.current) / (values.length - 1));
        setValue(values[index.current]);
        onValueChange(values[index.current], videoIndex);
      }
    }
  }

  // Shared logic for handling start of dragging (mouse or touch)
  function handleDragStart(clientX: number, track: HTMLElement) {
    if (isDragging) return;
    setIsDragging(true);
    const rect = track.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width),
    );
    let newIndex = Math.round(percentage * (values.length - 1));
    // We are assuming at least 30 values, otherwise this would need to be removed
    // This makes it so clicks lock to the edge of the slider when intended
    if (newIndex < values.length / 10 && index.current > values.length / 5) {
      newIndex = 0;
    } else if (
      newIndex > (values.length * 9) / 10 &&
      index.current < (values.length * 4) / 5
    ) {
      newIndex = values.length - 1;
    }
    index.current = newIndex;
    setFill((100 * newIndex) / (values.length - 1));
    setValue(values[newIndex]);
    onValueChange(values[newIndex], videoIndex);
    setTimeout(() => {
      thumbRef.current?.focus();
    }, 0);
  }

  // Moves the thumb when user presses down on the track
  function handleMouseDown(e: React.MouseEvent) {
    handleDragStart(e.clientX, e.currentTarget as HTMLElement);
  }

  // Moves the thumb when user touches the track
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
        style={{ width: `${fill}%` }}
      ></div>
      <div
        className={classNames(styles.thumb, {
          [styles.transition]: showTransition,
        })}
        style={{ left: `${fill}%` }}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={values.length - 1}
        aria-valuenow={index.current}
        aria-valuetext={value}
        aria-label={ariaLabel}
        onKeyDown={handleKeydown}
        ref={thumbRef}
      >
        <label className={styles.thumb_label}>
          <div className={styles.text_wrapper}>{value}</div>
        </label>
      </div>
    </div>
  );
}
