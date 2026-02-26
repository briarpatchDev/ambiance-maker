"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./categoryCard.module.css";
import classNames from "classnames";

export interface CategoryCardProps {
  title: string;
  tags: string[];
  description: string;
  href: string;
  image: string;
  imageAlt?: string;
  imageStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

export default function CategoryCard({
  title,
  tags,
  description,
  href,
  image,
  imageAlt,
  imageStyle,
  style,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={styles.category}
      style={{ ...style }}
      aria-label={`Go to the ${title} category.`}
    >
      <h1>{title}</h1>
      <div className={styles.tags}>
        {tags.map((tag, index) => {
          return (
            <div
              className={styles.tag}
              key={`${tag}-${index}`}
            >{`● ${tag}`}</div>
          );
        })}
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.image_wrapper}>
        <Image
          className={styles.image}
          height="250"
          width="250"
          src={image || "/images/categories/default.jpg"}
          style={imageStyle}
          alt={imageAlt ? imageAlt : ""}
        />
      </div>
    </Link>
  );
}
