import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Pages",
  description: `These are our test pages`,
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div>
          <h1>{`Ambiance Maker`}</h1>
          <Link href="/test_pages/ambiance_maker">{`Ambiance Maker`}</Link>
          <Link href="/test_pages/ambiance_maker_user">{`Ambiance Maker User`}</Link>
          <Link href="/test_pages/ambiance_maker_data">{`Ambiance Maker Data`}</Link>
          <Link href="/test_pages/share">{`Share`}</Link>
          <Link href="/test_pages/drafts/">{`Drafts`}</Link>
          <Link href="/test_pages/ambiance/">{`Ambiance`}</Link>
        </div>
        <div>
          <h1>{`Ambiance Misc`}</h1>
          <Link href="/test_pages/card">{`Ambiance Card`}</Link>
          <Link href="/test_pages/manager">{`Ambiance Manager`}</Link>
        </div>
        <div>
          <h1>{`Inputs`}</h1>
          <Link href="/test_pages/inputs/speed_slider">{`Speed Slider`}</Link>
          <Link href="/test_pages/inputs/volume_slider">{`Volume Slider`}</Link>
          <Link href="/test_pages/inputs/video_slider">{`Video Slider`}</Link>
          <Link href="/test_pages/inputs/ambiance_input">{`Ambiance Input`}</Link>
        </div>
        <div>
          <h1>{`Navbar`}</h1>
          <Link href="/test_pages/navbar">{`Navbar`}</Link>
        </div>
        <div>
          <h1>{`Misc`}</h1>
          <Link href="/test_pages/contact-us">{`Contact Us`}</Link>
          <Link href="/test_pages/404">{`404`}</Link>
        </div>
        <div>
          <h1>{`TOS & PP`}</h1>
          <Link href="/test_pages/policy/tos">{`Terms of Service`}</Link>
          <Link href="/test_pages/policy/pp">{`Privacy Policy`}</Link>
        </div>
      </div>
    </div>
  );
}
