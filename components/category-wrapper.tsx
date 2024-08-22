import { Suspense } from "react";
import { getCategories } from "@/services/category-service";
import { ICategory } from "@/types";
import { CategoryCardsSkeleton } from "./skeleton";
import CategoryCard from "./category-card";

export default async function CategoryWrapper() {
  const categoriesPromise: Promise<ICategory[]> = getCategories();

  return (
    <div className="w-full max-w-[1350px] mx-auto py-5 px-[5%] flex flex-col items-center">
      <h2 id="Category_Section" className="font-bold ml-auto text-gray-8 text-2xl sm:text-[26px] md:my-10 md:text-[30px] mt-8">
        منوی رستوران
      </h2>

      <Suspense fallback={<CategoryCardsSkeleton />}>
        <Categories categoriesPromise={categoriesPromise} />
      </Suspense>
    </div>
  );
}

async function Categories({
  categoriesPromise,
}: {
  categoriesPromise: Promise<ICategory[]>;
}) {
  const categories = await categoriesPromise;

  return (
    <div className="flex flex-row-reverse justify-center gap-5 lg:gap-0 flex-wrap py-10 category_container min-h-[400px]">
      {categories?.map((cateory: ICategory) => (
        <CategoryCard key={cateory.id} data={cateory} classname="" />
      ))}
    </div>
  );
}
