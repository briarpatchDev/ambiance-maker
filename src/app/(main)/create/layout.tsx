import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create",
  description:
    "Build a new ambiance from scratch. Add your tracks, set your loop points, then share it with the world.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
