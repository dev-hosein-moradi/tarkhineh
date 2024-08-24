import { Skeleton } from "@/components/ui/skeleton";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export const SmBranchCardSkeleton = () => {
  return (
    <div className="flex flex-row-reverse items-center space-x-4 my-1">
      <Skeleton className="h-4 w-[250px] my-2" />
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

export const MdBranchCardSkeleton = () => (
  <div className="w-[340px] h-[102px] border border-gray-4 rounded-md flex flex-row-reverse my-2 sm:mx-1 lg:flex-col lg:w-[230px] lg:h-[344px] bg-gray-100 animate-pulse">
    <div className="bg-gray-200 w-[160px] h-[100px] rounded-r-md lg:w-[228px] lg:h-[230px] lg:rounded-t-md"></div>
    <div className="flex-1 flex flex-col justify-center items-center p-4 space-y-2">
      <div className="h-[20px] w-[80%] bg-gray-200 rounded-md"></div>
      <div className="h-[16px] w-[60%] bg-gray-200 rounded-md"></div>
      <div className="h-[16px] w-[20%] bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

export const MdBranchCardsSkeleton = () => (
  <div className="flex flex-wrap w-full items-center justify-center py-5 space-y-2 lg:space-y-0 lg:space-x-2">
    <MdBranchCardSkeleton />
    <MdBranchCardSkeleton />
    <MdBranchCardSkeleton />
    <MdBranchCardSkeleton />
  </div>
);

// CategoryCardSkeleton Component
export function CategoryCardSkeleton() {
  return (
    <div className="relative border-Primary border rounded h-[111px] lg:h-[160px] w-[162px] lg:w-[230px] mx-1 sm:mx-2 my-12 lg:my-20 animate-pulse">
      <div className="absolute -top-14 lg:-top-24 left-[18px] lg:left-[11px] w-[125px] lg:w-[208px] h-[122px] lg:h-[205px] mx-auto bg-gray-200 rounded-full"></div>
      <div className="absolute -bottom-4 mx-[20%] lg:mx-[16%] bg-gray-200 w-[90px] lg:w-[155px] h-[32px] lg:h-[48px] rounded"></div>
    </div>
  );
}

// CategoryCardsSkeleton Component
export function CategoryCardsSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-5 lg:gap-0 py-10 min-h-[400px]">
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
    </div>
  );
}

export function BranchFoodCardSkeleton() {
  return (
    <div className="w-[230px] min-w-[230px] h-[280px] min-h-[280px] rounded-md border-[1px] border-gray-4 bg-white p-2">
      <Skeleton className="min-w-[213px] h-[130px] bg-gray-200 rounded-md"></Skeleton>

      <Skeleton className="h-4 bg-gray-200 rounded-md my-2 w-3/4 mx-auto"></Skeleton>

      <div className="flex flex-row justify-between items-center my-2">
        <div className="flex flex-row">
          <Skeleton className="w-[32px] h-[16px] bg-gray-200 rounded-lg"></Skeleton>
          <Skeleton className="w-12 h-4 bg-gray-200 rounded-md ml-1"></Skeleton>
        </div>
        <Skeleton className="w-5 h-5 bg-gray-200 rounded-full"></Skeleton>
      </div>

      <div className="flex flex-row justify-between items-center">
        <Skeleton className="w-16 h-4 bg-gray-200 rounded-md"></Skeleton>
        <div className="flex flex-row items-center">
          <Skeleton className="hidden sm:flex w-16 h-4 bg-gray-200 rounded-md mr-1"></Skeleton>
          <Skeleton className="w-8 h-4 bg-gray-200 rounded-md"></Skeleton>
        </div>
      </div>

      <Skeleton className="bg-gray-200 w-[213px] h-[32px] rounded-md mt-4"></Skeleton>
    </div>
  );
}

export function BranchFoodCardWrapperSkeleton() {
  return (
    <div className="w-[90%] mx-auto h-[380px] py-5 relative flex flex-row justify-end gap-4">
      <BranchFoodCardSkeleton />
      <BranchFoodCardSkeleton />
      <BranchFoodCardSkeleton />
      <BranchFoodCardSkeleton />
      <BranchFoodCardSkeleton />
      <BranchFoodCardSkeleton />
    </div>
  );
}

export function HeroSliderSkeleton() {
  return (
    <div>
      <div className="w-full max-w-full">
        <div className="relative h-auto">
          <div className="relative">
            <Skeleton className="w-full h-[450px] brightness-50" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
              <Skeleton className="w-full h-[5vw] lg:h-[4vw]" />
              <Skeleton className="w-[200px] h-10 bg-main my-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
