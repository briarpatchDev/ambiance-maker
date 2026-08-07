"use client";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import styles from "./page.module.css";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import { useUser } from "@/app/contexts/userContext";

export default function AmbianceClient({
  ambianceData,
}: {
  ambianceData: AmbianceData;
}) {
  const user = useUser();

  return (
    <div className={styles.ambiance}>
      <div className={styles.ambiance_maker_wrapper}>
        <AmbianceMaker
          mode="published"
          ambianceData={ambianceData}
          user={user}
        />
      </div>
    </div>
  );
}
