"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./breadcrumb.module.css";

interface BreadcrumbMenuProps {
  style?: React.CSSProperties;
}

export default function BreadcrumbMenu({ style }: BreadcrumbMenuProps) {
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter(Boolean);

  return (
    <div
      className={styles.breadcrumb}
      aria-label="breadcrumb"
      style={{ marginBottom: `${0.4 * pathSegments.length}rem` }}
    >
      {pathSegments.map((segment, index) => {
        segment = segment.replaceAll("_", "-");
        const label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        return index === pathSegments.length - 1 ? (
          <div
            className={styles.segment}
            style={{ transform: `translateY(${0.4 * index + 0.1}rem)` }}
            key={index}
            aria-current="page"
          >
            {label}
          </div>
        ) : (
          <div
            className={styles.segment}
            style={{ transform: `translateY(${0.4 * index}rem)` }}
            key={index}
          >
            <Link href={href}>{label}</Link>
            <div className={styles.dash}>{`➥`}</div>
          </div>
        );
      })}
    </div>
  );
}
