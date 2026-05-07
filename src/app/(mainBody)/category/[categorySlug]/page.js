import CategoryMainPage from "@/components/category";

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const categoryData = await fetch(`${process.env.API_PROD_URL}/category/slug/${categorySlug}`)
    .then((res) => res.json())
    .catch(() => null);

  if (!categoryData) return {};

  const title = categoryData?.meta_title || categoryData?.name || "";
  const description = categoryData?.meta_description || categoryData?.description || "";
  const ogTitle = categoryData?.og_title || title;
  const ogDescription = categoryData?.og_description || description;
  const ogImage = categoryData?.category_meta_image_id?.original_url || categoryData?.category_image?.original_url;
  const canonical = categoryData?.canonical_url;
  const robots = categoryData?.robots || "index, follow";

  return {
    title,
    description,
    keywords: categoryData?.meta_keywords || "",
    robots,
    ...(canonical && { alternates: { canonical } }),
    openGraph: {
      type: "website",
      title: ogTitle,
      description: ogDescription,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

const CategorySlugPage = async ({ params }) => {
  const { categorySlug } = await params;
  return <CategoryMainPage slug={categorySlug} />;
};

export default CategorySlugPage;
