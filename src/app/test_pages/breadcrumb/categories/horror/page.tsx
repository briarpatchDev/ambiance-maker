"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import BreadcrumbMenu from "@/app/components/Breadcrumb Menu/breadcrumb";

export default function Page() {
  const pathname = usePathname();

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <BreadcrumbMenu />
      </div>
      {`This is some text`}
    </div>
  );
}
