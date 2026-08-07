"use client";
import React, { useState, useEffect } from "react";
import styles from "./shareHits.module.css";
import Button from "@/app/components/Buttons/Button Set/button";

interface ShareHitItem {
  link_hash: string;
  url: string;
  hits: number;
  first_seen: string;
  last_seen: string;
}

export default function ShareHits() {
  const [items, setItems] = useState<ShareHitItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [days, setDays] = useState(7);
  const [minHits, setMinHits] = useState(50);

  useEffect(() => {
    fetchItems();
  }, [days, minHits]);

  async function fetchItems() {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/share-hits?days=${days}&min_hits=${minHits}`,
      );
      const data = await res.json();
      if (data.error) throw new Error();
      setItems(data.items);
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className={styles.share_hits}>
      <h2 className={styles.heading}>Share Link Hits</h2>
      <div className={styles.controls}>
        <div className={styles.control_group}>
          <span>Period:</span>
          {([7, 14, 30] as const).map((d) => (
            <button
              key={d}
              className={`${styles.control_btn} ${days === d ? styles.active : ""}`}
              onClick={() => setDays(d)}
            >
              {d}d
            </button>
          ))}
        </div>
        <div className={styles.control_group}>
          <span>Min hits:</span>
          {([10, 50, 100] as const).map((n) => (
            <button
              key={n}
              className={`${styles.control_btn} ${minHits === n ? styles.active : ""}`}
              onClick={() => setMinHits(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      {isError ? (
        <div className={styles.state_message}>
          <span>Failed to load.</span>
          <Button
            variant="secondary"
            onClick={fetchItems}
            style={{ minHeight: "4.8rem", fontSize: "1.6rem" }}
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className={styles.state_message}>Loading...</div>
      ) : items.length === 0 ? (
        <div className={styles.state_message}>
          No share links above threshold in this period.
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Link</th>
              <th className={styles.th_num}>Hits</th>
              <th className={styles.th_date}>First seen</th>
              <th className={styles.th_date}>Last seen</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.link_hash} className={styles.row}>
                <td className={styles.td_url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                    title={item.url}
                  >
                    {item.url.length > 64
                      ? `${item.url.slice(0, 64)}\u2026`
                      : item.url}
                  </a>
                </td>
                <td className={styles.td_num}>
                  {item.hits.toLocaleString()}
                </td>
                <td className={styles.td_date}>{formatDate(item.first_seen)}</td>
                <td className={styles.td_date}>{formatDate(item.last_seen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
