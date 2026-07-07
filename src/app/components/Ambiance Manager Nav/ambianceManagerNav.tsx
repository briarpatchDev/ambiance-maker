"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ambianceManagerNav.module.css";
import Draft from "@/app/components/Icons/draft";
import BookmarkIcon from "@/app/components/Icons/bookmark";
import classNames from "classnames";

export default function AmbianceManagerNav() {
  const pathname = usePathname();
  const isDrafts = pathname.startsWith("/drafts");
  const isFavorites = pathname.startsWith("/favorites");

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
        href="/favorites"
        className={classNames(styles.link, { [styles.active]: isFavorites })}
      >
        <BookmarkIcon className={styles.icon} />
        Favorites
      </Link>
    </nav>
  );
}
