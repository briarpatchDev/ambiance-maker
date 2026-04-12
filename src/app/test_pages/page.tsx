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
          <Link href="/test_pages/submit_ambiance/">{`Submit Ambiance`}</Link>
        </div>
        <div>
          <h1>{`Ambiance Misc`}</h1>
          <Link href="/test_pages/card">{`Ambiance Card`}</Link>
          <Link href="/test_pages/manager">{`Ambiance Manager`}</Link>
          <Link href="/test_pages/pagination">{`Pagination`}</Link>
        </div>
        <div>
          <h1>{`Navigation`}</h1>
          <Link href="/test_pages/side_menu">{`Side Menu`}</Link>
          <Link href="/test_pages/category">{`Category Card`}</Link>
          <Link href="/test_pages/navbar">{`Navbar`}</Link>
          <Link href="/test_pages/breadcrumb/categories/horror">{`Breadcrumb`}</Link>
        </div>
        <div>
          <h1>{`Admin`}</h1>
          <Link href="/test_pages/admin/submitted">{`View Submitted`}</Link>
          <Link href="/test_pages/admin/submitted/G0593m295">{`Review`}</Link>
          <Link href="/test_pages/admin/reports">{`View Reports`}</Link>
          <Link href="/test_pages/admin/reports/G0593m295">{`Review Report`}</Link>
        </div>
        <div>
          <h1>{`Inputs`}</h1>
          <Link href="/test_pages/inputs/speed_slider">{`Speed Slider`}</Link>
          <Link href="/test_pages/inputs/volume_slider">{`Volume Slider`}</Link>
          <Link href="/test_pages/inputs/video_slider">{`Video Slider`}</Link>
          <Link href="/test_pages/inputs/ambiance_input">{`Ambiance Input`}</Link>
          <Link href="/test_pages/buttons">{`Buttons`}</Link>
        </div>
        <div>
          <h1>{`Misc`}</h1>
          <Link href="/test_pages/hero">{`Hero`}</Link>
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
