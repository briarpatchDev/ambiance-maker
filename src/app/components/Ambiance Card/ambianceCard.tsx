"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ambianceCard.module.css";
import classNames from "classnames";

interface AmbianceCardProps {
  id: string;
  title: string;
  thumbnail: string;
  linkTo: "ambiance" | "draft";
  views?: number;
  author?: string;
  ratingTotal?: number;
  ratingCount?: number;
  datePublished?: Date;
  dateUpdated?: Date;
  mode?: "vertical" | "horizontal";
  style?: React.CSSProperties;
}

export default function AmbianceCard({
  id,
  title,
  thumbnail,
  linkTo,
  views,
  author,
  ratingTotal,
  ratingCount,
  datePublished,
  dateUpdated,
  mode = "vertical",
  style,
}: AmbianceCardProps) {
  const [property, setProperty] = useState();

  // Takes the number of views and abbreviates it
  function viewsMessage(views: number): string {
    if (views < 2) {
      return `No views`;
    }
    if (views < 1000) {
      return `${views} views`;
    }
    if (views < 10000) {
      return `${Math.floor(views / 100) / 10}k views`;
    }
    if (views < 1000000) {
      return `${Math.floor(views / 1000)}k views`;
    }
    return `${Math.floor(views / 1000000)}`;
  }

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Link
      href={`/${linkTo === "ambiance" ? `ambiance` : `drafts`}/${id}`}
      style={{ ...style }}
      className={styles.card}
      aria-label={`Go to ambiance "$${title}"`}
    >
      <div className={styles.image_wrapper}>
        <img
          className={styles.thumbnail}
          src={thumbnail}
          alt="Ambiance Thumbnail"
        />
      </div>
      <h1 className={styles.title}>{title}</h1>
      {linkTo === "ambiance" ? (
        <div className={styles.details_wrapper}>
          <div className={styles.details_row}>
            {views && <div className={styles.views}>{viewsMessage(views)}</div>}
            {datePublished && <div>{datePublished.toLocaleDateString()}</div>}
          </div>
          {author && (
            <div className={styles.author_row}>
              <div className={styles.author}>{author}</div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.details_wrapper}>
          <div className={styles.details_row}>
            {dateUpdated && <div>{dateUpdated.toLocaleDateString()}</div>}
          </div>
        </div>
      )}
    </Link>
  );
}
