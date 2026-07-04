"use client";
import React, { useState } from "react";
import styles from "./starRatingInput.module.css";

interface StarRatingInputProps {
  onRate: (stars: number) => Promise<void>;
  initialRating?: number | null;
}

const FULL_STAR_PATH =
  "m19 .791 5.646 11.438 12.624 1.835-9.135 8.904 2.156 12.573L19 29.604 7.709 35.541l2.156-12.573L.73 14.064l12.624-1.835z";
const EMPTY_STAR_PATH =
  "m33 10.822 5.797 11.746 1.163 2.357 2.602.378 12.963 1.884-9.38 9.143-1.882 1.835.444 2.591 2.214 12.91-11.594-6.096L33 46.348l-2.327 1.223-11.594 6.096 2.214-12.91.444-2.591-1.882-1.835-9.38-9.143 12.962-1.884 2.602-.378 1.163-2.357L33 10.822M33-.475l-10.281 20.83L-.27 23.696 16.365 39.91l-3.927 22.896L33 51.996l20.562 10.811-3.927-22.897L66.27 23.696l-22.99-3.341L33-.475z";

export default function StarRatingInput({
  onRate,
  initialRating,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(
    initialRating ?? null,
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleClick(star: number) {
    if (submitting) return;
    setSelected(star);
    setSubmitting(true);
    await onRate(star);
    setSubmitting(false);
  }

  const activeRating = hovered ?? selected;

  return (
    <div
      className={styles.stars}
      onMouseLeave={() => setHovered(null)}
      role="group"
      aria-label="Star rating input"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = activeRating !== null && star <= activeRating;
        const isPending = hovered !== null && star <= hovered;
        return (
          <button
            key={star}
            className={`${styles.star} ${
              isFilled
                ? isPending
                  ? styles.pending
                  : styles.selected
                : styles.empty
            }`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => handleClick(star)}
            disabled={submitting}
            aria-label={`Rate ${star} out of 5`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              viewBox={isFilled ? "0 0 37 35" : "0 0 67 63"}
            >
              <path d={isFilled ? FULL_STAR_PATH : EMPTY_STAR_PATH} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
