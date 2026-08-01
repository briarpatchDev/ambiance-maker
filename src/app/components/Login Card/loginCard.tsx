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
        Create an account to save your mixes, publish them for others to
        discover, and keep a collection of your favorites.
      </p>
      <div className={styles.button_wrapper}>
        <Button
          variant="primary"
          onClick={login}
          width="full"
          icon={
            <Image
              height={48}
              width={48}
              alt="Google icon"
              src="/images/google-icon.svg"
              className={styles.google_logo}
            />
          }
          text="Sign in with Google"
          style={{
            color: "rgb(60,60,60)",
            backgroundColor: "rgb(240,240,240)",
            padding: "0.6rem 2.4rem",
            borderRadius: "0.8em",
            margin: "0 1.2rem",
          }}
        />
      </div>
    </div>
  );
}
