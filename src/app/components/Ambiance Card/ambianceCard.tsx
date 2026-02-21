"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ambianceCard.module.css";
import TooltipLink from "@/app/components/Tooltip Link/tooltipLink";
import classNames from "classnames";

// The description that appears as a tooltip
export function Description({
  description,
}: {
  description: string | undefined;
}) {
  return (
    description && (
      <div
        id="description"
        className={styles.description_wrapper}
        role="tooltip"
      >
        <div className={styles.description}>{description}</div>
      </div>
    )
  );
}

export interface AmbianceCardProps {
  id: string;
  title: string;
  thumbnail: string;
  linkTo: "ambiance" | "draft";
  linkTarget?: React.HTMLAttributeAnchorTarget;
  containerRef: React.RefObject<HTMLElement | null>;
  author?: string;
  description?: string;
  views?: number;
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
  linkTarget = "_self",
  containerRef,
  views,
  author,
  description,
  ratingTotal,
  ratingCount,
  datePublished,
  dateUpdated,
  mode = "vertical",
  style,
}: AmbianceCardProps) {
  // Takes the number of views and abbreviates it
  function formatViews(views: number): string {
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
    return `${Math.floor(views / 100000) / 10}M views`;
  }

  return (
    <div
      className={classNames(styles.card_wrapper, {
        [styles.horizontal]: mode === "horizontal",
      })}
    >
      <TooltipLink
        href={`/${linkTo === "ambiance" ? `ambiance` : `drafts`}/${id}`}
        target={linkTarget}
        direction="bottom"
        tooltip={
          description ? <Description description={description} /> : undefined
        }
        tooltipId={description ? "description" : ""}
        aria-label={`Go to /${linkTo === "ambiance" ? `ambiance` : `draft`} "${title}"`}
        offset={0.4}
        containerRef={containerRef}
      >
        <div style={{ ...style }} className={styles.card}>
          <div className={styles.image_wrapper}>
            <img
              className={styles.thumbnail}
              src={thumbnail}
              alt="Ambiance Thumbnail"
            />
          </div>

          <div className={styles.meta_wrapper}>
            <h1 className={styles.title}>{title}</h1>
            {linkTo === "ambiance" ? (
              <div className={styles.meta_section}>
                <div className={styles.meta_row}>
                  {views && (
                    <div className={styles.views}>{formatViews(views)}</div>
                  )}
                  {datePublished && (
                    <div>{datePublished.toLocaleDateString()}</div>
                  )}
                </div>
                {author && (
                  <div className={styles.byline}>
                    <div className={styles.author}>{author}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.meta_wrapper}>
                <div className={styles.meta_row}>
                  {dateUpdated && <div>{dateUpdated.toLocaleDateString()}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </TooltipLink>
    </div>
  );
}
