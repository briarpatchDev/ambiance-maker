"use client";
import { usePathname } from "next/navigation";
import NotFound from "@/app/components/Errors/Not Found/notFound";
import styles from "./page.module.css";

export default function NotFoundPage() {
  const pathname = usePathname();
  const isCreatorPath = pathname.startsWith("/@");

  return (
    <div className={styles.not_found}>
      <NotFound
        errorMessage={
          isCreatorPath
            ? "This creator hasn't made a sound..."
            : "The sound doesn't reach this far..."
        }
        buttonText="Return Home"
        href="/"
      />
    </div>
  );
}
