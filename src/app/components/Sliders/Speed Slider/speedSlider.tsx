"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./speedSlider.module.css";
import classNames from "classnames";
import DiscreteSlider from "../Discrete Slider/discreteSlider";
import SpeedIcon from "@/app/components/Icons/speed";

interface SpeedSliderProps {
  onValueChange: (value: string, videoIndex?: number) => void;
  playbackSpeed?: number;
  videoIndex?: number;
  style?: React.CSSProperties;
}

const values: string[] = [];
for (let i = 25; i <= 200; i += 5) {
  values.push((i / 100).toFixed(2) + `x`);
}

export default function SpeedSlider({
  onValueChange,
  playbackSpeed,
  videoIndex,
  style,
}: SpeedSliderProps) {
  return (
    <div style={{ ...style }} className={styles.speed_slider}>
      <SpeedIcon />
      <DiscreteSlider
        values={values}
        defaultValue="1.00x"
        currentValue={
          playbackSpeed ? `${playbackSpeed?.toFixed(2)}x` : undefined
        }
        onValueChange={onValueChange}
        ariaLabel={"Video speed slider"}
        videoIndex={videoIndex}
      />
    </div>
  );
}
