"use client";
import React, { useRef } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { User } from "@/app/contexts/userContext";
import Carousel from "@/app/components/Carousel/carousel";
import AmbianceCard from "@/app/components/Ambiance Card/ambianceCard";
import LinkButton from "@/app/components/Buttons/Link Button/linkButton";

export interface DraftItem {
  id: string;
  title: string;
  thumbnail: string;
  updated_at: string;
}

export interface RecentAmbianceItem {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  published_at: string;
  author?: string;
}

interface DashboardProps {
  user: User;
  drafts: DraftItem[];
  recentAmbiances: RecentAmbianceItem[];
}

export default function Dashboard({
  user,
  drafts,
  recentAmbiances,
}: DashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.dashboard} ref={containerRef}>
      <section className={styles.section}>
        {recentAmbiances.length > 0 ? (
          <Carousel
            width="100%"
            columnGap="1.2rem"
            scrollValue={320}
            label="Latest Ambiances"
          >
            {recentAmbiances.map((ambiance) => (
              <div key={ambiance.id} style={{ flexShrink: 0, display: "flex" }}>
                <AmbianceCard
                  id={ambiance.id}
                  title={ambiance.title}
                  thumbnail={ambiance.thumbnail}
                  linkTo="ambiance"
                  containerRef={containerRef}
                  author={ambiance.author}
                  views={ambiance.views}
                  datePublished={new Date(ambiance.published_at)}
                  mode="vertical"
                />
              </div>
            ))}
          </Carousel>
        ) : null}
      </section>

      <section className={styles.section}>
        {drafts.length > 0 && (
          <Carousel
            width="100%"
            columnGap="1.2rem"
            scrollValue={320}
            label="Your Drafts"
          >
            {drafts.map((draft) => (
              <div key={draft.id} style={{ flexShrink: 0, display: "flex" }}>
                <AmbianceCard
                  id={draft.id}
                  title={draft.title}
                  thumbnail={draft.thumbnail}
                  linkTo="draft"
                  containerRef={containerRef}
                  dateUpdated={new Date(draft.updated_at)}
                  mode="vertical"
                />
              </div>
            ))}
          </Carousel>
        )}
      </section>

      <div
        className={styles.button_wrapper}
        style={{ marginTop: "1.2rem" }}
      >
        <LinkButton
          href="/create"
          buttonStyle={{ minHeight: "7.2rem", fontSize: "2.2rem" }}
          width={60}
        >
          Create Something New
        </LinkButton>
      </div>
    </div>
  );
}
