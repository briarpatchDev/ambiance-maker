import type { Metadata } from "next";
import NotFoundClient from "./not-found-client";

export const metadata: Metadata = {
  title: "Ambiance Maker",
  description: "Page not found",
};

export default function Page() {
  return <NotFoundClient />;
}
