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
  onValueChange: (value: string) => void;
  ariaLabel: string;
  style?: React.CSSProperties;
}

export default function DiscreteSlider({
  values,
  defaultValue,
  onValueChange,
  ariaLabel,
  style,
}: DiscreteSliderProps) {
  const [value, setValue] = useState(defaultValue);
  const index = useRef(values.findIndex((value) => value === defaultValue));
  const [fill, setFill] = useState((100 * index.current) / (values.length - 1));
  const [isDragging, setIsDragging] = useState(false);
  const thumbRef = useRef<null | HTMLDivElement>(null);
  const trackRef = useRef<null | HTMLDivElement>(null);

  // Calls a parent function when the value changes
  useEffect(() => {
    onValueChange(value);
  }, [value]);

  // Handles dragging the thumb
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      const newIndex = Math.round(percentage * (values.length - 1));
      index.current = newIndex;
      setFill((100 * newIndex) / (values.length - 1));
      setValue(values[newIndex]);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Start dragging when mouse down on thumb
  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setIsDragging(true);
    thumbRef.current?.focus();
  }

  // Moves the thumb when user presses on arrow keys
  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      if (index.current < values.length - 1) {
        index.current++;
        setFill((100 * index.current) / (values.length - 1));
        setValue(values[index.current]);
      }
    } else if (e.key === "ArrowLeft") {
      if (index.current > 0) {
        index.current--;
        setFill((100 * index.current) / (values.length - 1));
        setValue(values[index.current]);
      }
    }
  }

  // Moves the thumb when user clicks on the track
  function handleClick(e: React.MouseEvent) {
    if (isDragging) return;
    thumbRef.current?.focus();
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    let newIndex = Math.round(percentage * (values.length - 1));
    // We are assuming at least 30 values, otherwise this would need to be removed
    // This makes it so it locks to the edge of the slider
    if (newIndex < values.length / 10 && index.current > values.length / 5) {
      newIndex = 0;
    } else if (
      newIndex > (values.length * 9) / 10 &&
      index.current < (values.length * 4) / 5
    ) {
      newIndex = values.length - 1;
    }
    // Always moves the index if user click in a different place
    if (newIndex === index.current) {
      const unroundedIndex = percentage * (values.length - 1);
      if (unroundedIndex < newIndex && newIndex > 0) {
        newIndex--;
      } else if (unroundedIndex > newIndex && newIndex < values.length - 1) {
        newIndex++;
      }
    }
    index.current = newIndex;
    setFill((100 * newIndex) / (values.length - 1));
    setValue(values[newIndex]);
  }

  return (
    <div
      style={{ ...style }}
      className={styles.track}
      onClick={handleClick}
      ref={trackRef}
    >
      <div className={styles.fill} style={{ width: `${fill}%` }}></div>
      <div
        className={styles.thumb}
        style={{ left: `${fill}%` }}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={values.length - 1}
        aria-valuenow={index.current}
        aria-valuetext={value}
        aria-label={ariaLabel}
        onKeyDown={handleKeydown}
        onMouseDown={handleMouseDown}
        ref={thumbRef}
      ></div>
      <label className={styles.thumb_label} style={{ left: `${fill}%` }}>
        <div className={styles.text_wrapper}>{value}</div>
      </label>
    </div>
  );
}
