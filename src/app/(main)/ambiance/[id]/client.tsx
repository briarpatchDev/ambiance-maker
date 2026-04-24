"use client";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import styles from "./page.module.css";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import NotFound from "@/app/components/Errors/Not Found/notFound";
import { useUser } from "@/app/contexts/userContext";

export default function AmbianceClient({
  ambianceData,
}: {
  ambianceData: AmbianceData | undefined;
}) {
  const user = useUser();
  return ambianceData ? (
    <div className={styles.ambiance}>
      <div className={styles.ambiance_maker_wrapper}>
        <AmbianceMaker
          mode="published"
          ambianceData={ambianceData}
          user={user}
        />
      </div>
    </div>
  ) : (
    <div className={styles.not_found}>
      <NotFound
        errorMessage="Ambiance not found"
        buttonText="Go Back"
        href="/"
      />
    </div>
  );
}
