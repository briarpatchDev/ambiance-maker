import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";
import type { Metadata } from "next";
import NotFound from "@/app/components/Errors//Not Found/notFound";

export const metadata: Metadata = {
  title: "Website - 404",
  description: `Page not found`,
};

export default function Page() {
  return (
    <div className={styles.page}>
      <NotFound />
    </div>
  );
}
