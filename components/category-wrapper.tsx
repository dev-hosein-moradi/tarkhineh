import { Suspense } from "react";
import { CategoryCardsSkeleton } from "./skeleton";
import dynamic from "next/dynamic";

const Categories = dynamic(() => import("./categories"));

export default async function CategoryWrapper() {
  return (
    <div className="w-full max-w-[1350px] mx-auto py-5 px-[5%] flex flex-col items-center">
      <h2
        id="Category_Section"
        className="font-bold ml-auto text-gray-8 text-2xl sm:text-[26px] md:my-10 md:text-[30px] mt-8"
      >
        منوی رستوران
      </h2>

      <Suspense fallback={<CategoryCardsSkeleton />}>
        <Categories />
      </Suspense>
    </div>
  );
}
