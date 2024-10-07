import { Suspense } from "react";
import { MdBranchCardsSkeleton } from "./skeleton";
import dynamic from "next/dynamic";
const Branchs = dynamic(() => import("./branches"));

export default async function BranchsWrapper() {
  return (
    <div className="w-full max-w-[1350px] mx-auto py-5 px-[5%] flex flex-col items-center">
      <h2 className="font-bold ml-auto text-gray-8 text-2xl sm:text-[26px] md:my-10 md:text-[30px] mt-8">
        ترخینه گردی
      </h2>

      <Suspense fallback={<MdBranchCardsSkeleton />}>
        <Branchs />
      </Suspense>
    </div>
  );
}
