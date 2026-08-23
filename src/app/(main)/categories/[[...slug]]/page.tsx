import CategoriesPage from "@/app/components/Categories/categories";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <CategoriesPage slug={slug} />;
}
