"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import Category, {
  CategoryCardProps,
} from "@/app/components/Category Card/categoryCard";

export default function Page() {
  const pathname = usePathname();
  const categoryData: CategoryCardProps[] = [
    {
      title: "Horror",
      tags: ["Ethereal", "Mysterious", "Haunted"],
      href: `/horror`,
      description:
        "Dive into eerie atmospheres filled with haunted houses, mysterious whispers, and otherworldly sounds.",
      image: "/images/categories/horror.jpg",
      imageAlt: "An old haunted house in a dark misty forest",
      imageStyle: { objectPosition: "0 30%" },
    },
    {
      title: "Horror Deluxe",
      tags: ["Ethereal", "Mysterious", "Haunted", "Scary", "Terror-fic"],
      href: `/horror`,
      description:
        "Dive into eerie atmospheres filled with haunted houses, mysterious whispers, and otherworldly sounds. There's even more of them in this category right here.",
      image: "/images/categories/horror.jpg",
      imageAlt: "An old haunted house in a dark misty forest",
      imageStyle: { objectPosition: "0 30%" },
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        {categoryData.map((item, i) => {
          return (
            <Category
              title={item.title}
              tags={item.tags}
              href={pathname + item.href}
              description={item.description}
              image={item.image}
              imageStyle={item?.imageStyle}
              key={`${item.title}-${i}`}
            />
          );
        })}
      </div>
    </div>
  );
}
