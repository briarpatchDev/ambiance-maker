"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import BreadcrumbMenu, {
  Breadcrumb,
} from "@/app/components/Breadcrumb Menu/breadcrumb";

export default function Page() {
  const pathname = usePathname();

  const menu: Breadcrumb[] = [
    { title: "Categories", href: "/categories" },
    { title: "Relaxing", href: "/categories/relaxing" },
    { title: "Beach", href: "/categories/beach" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <BreadcrumbMenu linkOnLast={false} />
      </div>
      {`This is some text`}
      <div className={styles.wrapper}>
        <BreadcrumbMenu menu={menu} linkOnLast={true} />
      </div>
      {`This is some text`}
    </div>
  );
}
