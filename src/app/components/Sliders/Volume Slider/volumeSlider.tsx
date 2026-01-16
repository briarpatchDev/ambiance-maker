"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./volumeSlider.module.css";
import classNames from "classnames";
import DiscreteSlider from "../Discrete Slider/discreteSlider";
import LowVolume from "@/app/components/Icons/volume_low";
import MediumVolume from "@/app/components/Icons/volume_medium";
import HighVolume from "@/app/components/Icons/volume_high";
import Muted from "@/app/components/Icons/volume_muted";
import VolumeMuted from "@/app/components/Icons/volume_muted";
import VolumeMedium from "@/app/components/Icons/volume_medium";
import VolumeLow from "@/app/components/Icons/volume_low";
import VolumeHigh from "@/app/components/Icons/volume_high";

interface VolumeSliderProps {
  onValueChange: (value: string, videoIndex?: number) => void;
  videoIndex?: number;
  style?: React.CSSProperties;
}

const values: string[] = [];
for (let i = 0; i <= 100; i += 1) {
  values.push(`${i.toString()}%`);
}

export default function VolumeSlider({
  onValueChange,
  videoIndex,
  style,
}: VolumeSliderProps) {
  const [volume, setVolume] = useState(100);

  function onVolumeChange(value: string) {
    onValueChange(value);
    setVolume(parseInt(value));
  }

  return (
    <div style={{ ...style }} className={styles.volume_slider}>
      {volume === 0 && <VolumeMuted />}
      {volume > 0 && volume <= 33 && <VolumeLow />}
      {volume > 33 && volume <= 66 && <VolumeMedium />}
      {volume > 66 && <VolumeHigh />}
      <DiscreteSlider
        values={values}
        defaultValue="100%"
        onValueChange={onVolumeChange}
        ariaLabel={"Volume slider"}
        videoIndex={videoIndex}
      />
    </div>
  );
}
