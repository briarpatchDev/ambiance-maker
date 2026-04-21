"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ambianceManagerNav.module.css";
import Draft from "@/app/components/Icons/draft";
import Published from "@/app/components/Icons/published";
import classNames from "classnames";

export default function AmbianceManagerNav() {
  const pathname = usePathname();
  const isDrafts = pathname.startsWith("/drafts");
  const isPublished = pathname.startsWith("/published");

  return (
    <nav className={styles.nav} aria-label="Drafts and Published navigation">
      <Link
        href="/drafts"
        className={classNames(styles.link, { [styles.active]: isDrafts })}
      >
        <Draft className={styles.icon} />
        Drafts
      </Link>
      <span className={styles.separator}>/</span>
      <Link
        href="/published"
        className={classNames(styles.link, { [styles.active]: isPublished })}
      >
        <Published className={styles.icon} />
        Published
      </Link>
    </nav>
  );
}
