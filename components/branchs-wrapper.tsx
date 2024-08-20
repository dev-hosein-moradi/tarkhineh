import { getBranchs } from "@/services/branch-service";
import { IBranch } from "@/types";
import { Suspense } from "react";
import { MdBrnach } from "./branch-card";
import { MdBranchCardsSkeleton } from "./skeleton";

export default async function BranchsWrapper() {
  const branchsPromise: Promise<IBranch[]> = getBranchs();
  return (
    <div className="w-full max-w-[1350px] mx-auto py-5 px-[5%] flex flex-col items-center">
      <h2 className="font-bold ml-auto text-gray-8 text-2xl sm:text-[26px] md:my-10 md:text-[30px] mt-8">
        ترخینه گردی
      </h2>

      <Suspense fallback={<MdBranchCardsSkeleton />}>
        <Branchs branchsPromise={branchsPromise} />
      </Suspense>
    </div>
  );
}

async function Branchs({
  branchsPromise,
}: {
  branchsPromise: Promise<IBranch[]>;
}) {
  const branchs = await branchsPromise;
  return (
    <div className="flex flex-row-reverse flex-wrap w-full min-h-[400px] items-center justify-center py-5">
      {branchs?.map((branch) => (
        <MdBrnach key={branch.id} data={branch} className="" />
      ))}
    </div>
  );
}
