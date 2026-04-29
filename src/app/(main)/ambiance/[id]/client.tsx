"use client";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import styles from "./page.module.css";
import { AmbianceData } from "@/app/components/Ambiance Maker/ambianceMaker";
import MessageBox from "@/app/components/Message Box/messageBox";
import { useUser } from "@/app/contexts/userContext";
import { useRouter } from "next/navigation";

export default function AmbianceClient({
  ambianceData,
}: {
  ambianceData: AmbianceData | undefined;
}) {
  const router = useRouter();
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
      <MessageBox
        message="Ambiance not found"
        buttonText="Go Back"
        ariaLive="assertive"
        role="alert"
        onClick={() => {
          router.back();
        }}
      />
    </div>
  );
}
