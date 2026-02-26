"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import SideMenu from "@/app/components/Side Menu/sideMenu";
import AmbianceMaker from "@/app/components/Ambiance Maker/ambianceMaker";
import { useRef, useEffect, useState, useLayoutEffect } from "react";

export default function Page() {


  return (
    <div className={styles.page} >
      <SideMenu/>
      <div className={styles.wrapper}>
        <AmbianceMaker mode="create" />
      </div>
    </div>
  );
}
