import type { Metadata } from "next";
import PrivacyPolicy from "@/app/components/Policy/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Ambiance Maker",
};

export default function Page() {
  return <PrivacyPolicy />;
}
