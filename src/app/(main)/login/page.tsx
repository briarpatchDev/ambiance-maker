"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/app/contexts/userContext";
import LoginCard from "@/app/components/Login Card/loginCard";
import styles from "./page.module.css";

export default function Page() {
  const [isInitalized, setIsInitialized] = useState(false);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    user ? router.replace("/") : setIsInitialized(true);
  }, []);

  return (
    isInitalized && (
      <div className={styles.login_page}>
        <LoginCard path="/" />
      </div>
    )
  );
}
