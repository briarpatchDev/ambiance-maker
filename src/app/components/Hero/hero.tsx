"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./hero.module.css";
import classNames from "classnames";

interface HeroProps {
  style?: React.CSSProperties;
}

export default function Hero({ style }: HeroProps) {
  return (
    <header className={styles.hero} style={{ ...style }} role="banner">
      <h1 className={styles.heading}>Create Your Perfect Ambiance</h1>
      <p className={styles.subtitle}>
        Mix YouTube videos into relaxing background soundscapes
      </p>
    </header>
  );
}
