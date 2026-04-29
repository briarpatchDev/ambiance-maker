"use client";
import Image from "next/image";
import Button from "@/app/components/Buttons/Button Set/button";
import styles from "./loginCard.module.css";

interface LoginCardProps {
  path?: string;
}

export default function LoginCard({ path = "/" }: LoginCardProps) {
  function login() {
    window.location.href = `/api/auth/google/login?path=${encodeURIComponent(path)}`;
  }

  return (
    <div className={styles.card}>
      <Image
        src="/images/logo.jpg"
        alt="Ambiance Maker Logo"
        width={80}
        height={80}
        className={styles.logo}
      />
      <h1 className={styles.title}>Ambiance Maker</h1>
      <p className={styles.subtitle}>
        Sign in to save and share your ambiances.
      </p>
      <Button
        variant="primary"
        onClick={login}
        width="full"
        icon={
          <Image
            height={58}
            width={58}
            alt="Google icon"
            src="/images/google-icon.svg"
            className={styles.google_logo}
          />
        }
        text="Sign in with Google"
        style={{
          color: "rgb(20,20,20)",
          backgroundColor: "rgb(240,240,240)",
          padding: "1.6rem 2.4rem",
          borderRadius: "2.4rem",
          height: "8.0rem",
        }}
      />
    </div>
  );
}
