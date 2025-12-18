"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./component.module.css";
import classNames from "classnames";

interface AmbiancePlayerProps {
  style?: React.CSSProperties;
}

export default function AmbiancePlayer({ style }: AmbiancePlayerProps) {
  const [property, setProperty] = useState();

  useEffect(() => {
    return () => {};
  }, []);

  return <div style={{ ...style }}>{`This is our ambiance player`}</div>;
}
