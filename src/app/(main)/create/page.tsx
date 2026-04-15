"use client";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import styles from "./page.module.css";
import { useUser } from "@/app/contexts/userContext";

export default function Page() {
  const user = useUser();
  return (
    <div className={styles.create}>
      <div className={styles.ambiance_maker_wrapper}>
        <AmbianceMaker mode="create" user={user} />
      </div>
    </div>
  );
}
