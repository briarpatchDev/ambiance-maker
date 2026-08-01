import type { Metadata } from "next";
import TermsOfService from "@/app/components/Policy/termsOfService";

export const metadata: Metadata = {
  title: "Terms of Service | Ambiance Maker",
};

export default function Page() {
  return <TermsOfService />;
}
