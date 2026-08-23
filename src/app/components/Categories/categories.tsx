"use client";
import React, { useRef } from "react";
import { notFound } from "next/navigation";
import styles from "./categories.module.css";
import CategoryCard from "@/app/components/Category Card/categoryCard";
import BreadcrumbMenu from "@/app/components/Breadcrumb Menu/breadcrumb";
import type { Breadcrumb } from "@/app/components/Breadcrumb Menu/breadcrumb";
import Pagination from "@/app/components/Pagination/pagination";
import { categories, categoryMeta } from "@/app/lib/categories";

interface CategoriesPageProps {
  slug: string[] | undefined;
}

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, "-");
}

function slugToName(slug: string, pool: string[]): string | undefined {
  return pool.find((name) => nameToSlug(name) === slug);
}

export default function CategoriesPage({ slug }: CategoriesPageProps) {
  const componentRef = useRef<HTMLDivElement | null>(null);

  // Resolve slug to category/subcategory names
  const topLevelKeys = Object.keys(categories);
  const catSlug = slug?.[0];
  const subcatSlug = slug?.[1];

  if (slug && slug.length > 2) notFound();

  const catName = catSlug ? slugToName(catSlug, topLevelKeys) : undefined;
  if (catSlug && !catName) notFound();

  const subcatKeys = catName ? Object.keys(categories[catName]) : [];
  const subcatName =
    catName && subcatSlug ? slugToName(subcatSlug, subcatKeys) : undefined;
  if (subcatSlug && !subcatName) notFound();

  // Determine which keys to display and the page heading
  let displayKeys: string[];
  let heading: string;
  let hrefPrefix: string;

  if (!catName) {
    // /categories — show all top-level categories
    displayKeys = topLevelKeys;
    heading = "Categories";
    hrefPrefix = "/categories";
  } else if (!subcatName && subcatKeys.length > 0) {
    // /categories/moods — show subcategories
    displayKeys = subcatKeys;
    heading = catName;
    hrefPrefix = `/categories/${catSlug}`;
  } else {
    // Endpoint: no subcategories, or reached a leaf subcategory
    displayKeys = [];
    heading = subcatName ?? catName;
    hrefPrefix = "";
  }

  // Build breadcrumb with proper casing from category key names
  const breadcrumbMenu: Breadcrumb[] = [
    { title: "Categories", href: "/categories" },
    ...(catName ? [{ title: catName, href: `/categories/${catSlug}` }] : []),
    ...(subcatName
      ? [
          {
            title: subcatName,
            href: `/categories/${catSlug}/${subcatSlug}`,
          },
        ]
      : []),
  ];

  return (
    <div className={styles.categories_page}>
      <div className={styles.content_wrapper} ref={componentRef}>
        {catName && (
          <div className={styles.breadcrumb_wrapper}>
            <BreadcrumbMenu linkOnLast={false} menu={breadcrumbMenu} />
          </div>
        )}
        {displayKeys.length > 0 && (
          <div className={styles.header}>
            <h1>{heading}</h1>
          </div>
        )}
        {displayKeys.length > 0 ? (
          <div
            className={styles.cards_wrapper}
            style={{ width: "100%", padding: "0 0.4rem" }}
          >
            {displayKeys.map((name) => {
              const meta = categoryMeta[name];
              if (!meta) return null;
              return (
                <div key={name} className={styles.card_container}>
                  <CategoryCard
                    title={name}
                    tags={meta.tags.map(
                      (tag) => tag.charAt(0).toUpperCase() + tag.slice(1),
                    )}
                    description={meta.description}
                    href={`${hrefPrefix}/${nameToSlug(name)}`}
                    image={meta.image}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Pagination
            title={heading}
            collection={String(categoryMeta[heading]?.id)}
            containerRef={componentRef}
          />
        )}
      </div>
    </div>
  );
}
