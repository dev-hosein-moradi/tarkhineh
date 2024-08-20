import { Skeleton } from "@/components/ui/skeleton";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export const SmBranchCardSkeleton = () => {
  return (
    <div className="flex flex-row-reverse items-center space-x-4 my-1">
      <Skeleton className="h-[80px] w-[80px] rounded-[5px]" />
      <div className="space-y-2 flex flex-col items-end mx-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

export const SmBranchCardsSkeleton = () => {
  return (
    <div className="flex flex-col p-2">
      <SmBranchCardSkeleton />
      <SmBranchCardSkeleton />
      <SmBranchCardSkeleton />
      <SmBranchCardSkeleton />
    </div>
  );
};

export const MdBranchCardSkeleton = () => {
  return (
    <div
      className={`${shimmer} w-[340px] h-[102px] border-[1px] border-gray-4 rounded-md relative flex flex-row-reverse my-2 sm:mx-1 lg:flex-col lg:w-[230px] lg:h-[344px] bg-gray-100 animate-pulse`}
    >
      <div className="bg-gray-200 w-[160px] min-w-[140px] h-[100px] rounded-r-md lg:w-[228px] lg:h-[230px] lg:rounded-r-none lg:rounded-t-md"></div>
      <div className="flex-1 flex flex-col justify-between items-center p-4">
        <div className="h-[20px] w-[80%] bg-gray-200 rounded-md"></div>
        <div className="h-[16px] w-[60%] bg-gray-200 rounded-md"></div>
        <div className="h-[16px] w-[20%] bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

export const MdBranchCardsSkeleton = () => {
  return (
    <div className="flex flex-row-reverse flex-wrap w-full items-center justify-center py-5">
      <MdBranchCardSkeleton />
      <MdBranchCardSkeleton />
      <MdBranchCardSkeleton />
      <MdBranchCardSkeleton />
    </div>
  );
};

export function CategoryCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative border-Primary border-[1px] rounded-[4px] h-[111px] lg:h-[160px] w-[162px] lg:w-[230px] mx-1 sm:mx-2 my-12 lg:my-20`}
    >
      <div className=" top-0 left-0 w-full h-full bg-gray-100 rounded-[4px] overflow-hidden"></div>
      <div
        className={`${shimmer} absolute -top-12 lg:-top-20 left-[10%] lg:left-[7%] w-[130px] lg:w-[200px] h-[130px] lg:h-[200px] rounded-[50%] bg-gray-200 -z-10`}
      ></div>
      <div
        className={`${shimmer} absolute -bottom-4 mx-[20%] lg:mx-[16%] bg-gray-200 w-[90px] lg:w-[155px] h-[32px] lg:h-[48px] rounded-sm -z-10`}
      ></div>
    </div>
  );
}

export function CategoryCardsSkeleton() {
  return (
    <div className="flex flex-row-reverse justify-center gap-5 lg:gap-0 flex-wrap py-10 min-h-[400px]">
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
    </div>
  );
}
