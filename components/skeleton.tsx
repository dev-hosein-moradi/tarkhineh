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
            <Skeleton className="w-full h-[450px] bg-gray-100" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
              <Skeleton className="w-[70%] bg-gray-200 mx-auto h-[3vw]" />
              <Skeleton className="w-[200px] h-10 bg-main my-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BranchReviewSkeleton() {
  return (
    <div className="py-16">
      <h2 className="w-full mx-auto py-4">
        <Skeleton className="w-[40%] bg-gray-200 h-4 mx-auto" />
      </h2>
      <div className="relative h-[300px] sm:h-[400px]">
        <Skeleton className="w-full h-full" />

        <div className="bg-white pb-2 w-full sm:w-[80%] md:w-[70%] absolute translate-x-[-50%] left-[50%] -bottom-5 mx-auto h-20 sm:h-24 rounded border-main border flex flex-col sm:flex-row sm:items-center justify-around px-2">
          <article className="flex flex-row-reverse sm:flex-col flex-1 text-center w-full items-center justify-start">
            <Skeleton className="w-[80%] h-4" />
          </article>
          <div className="flex flex-2 flex-row items-center justify-between sm:w-[60%]">
            <article className="flex flex-row-reverse sm:flex-col items-center flex-1">
              <Skeleton className="w-[80%] h-4" />
            </article>
            <article className="flex flex-row-reverse sm:flex-col items-center justify-start flex-1">
              <Skeleton className="w-[80%] h-4" />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

export const MenuBarSkeleton = () => {
  const skeletonItems = Array(4).fill(null);
  return (
    <div>
      <ul className="flex flex-row-reverse items-center justify-start px-3 h-12 gap-2 bg-gray-100 md:px-[4%]">
        {skeletonItems.map((_, index) => (
          <Skeleton
            key={index}
            className="w-20 h-4 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </ul>
    </div>
  );
};

export const MenuFoodCardSkeleton = () => {
  return (
    <div className="w-[360px] lg:w-[400px] min-w-[320px] lg:min-w-[400px] h-[120px] lg:h-[170px] min-h-[120px] lg:min-h-[170px] rounded-md border-[1px] border-gray-4 bg-white p-2 shadow-card-shadow hover:shadow-content-card-shadow ease-in-out duration-300 flex flex-row-reverse justify-self-center">
      <Skeleton className="min-w-[100px] lg:min-w-[140px] h-[102px] lg:h-[152px] rounded-md" />

      <div className="flex flex-col justify-between items-center w-full pr-2">
        <span className="flex flex-row-reverse items-center justify-between w-full">
          <Skeleton className="h-5 lg:h-7 w-[120px] lg:w-[100px] rounded" />
          <div className="flex flex-row">
            <Skeleton className="h-[19px] w-[30px] rounded-lg" />
            <Skeleton className="h-4 w-[40px] lg:w-[60px] ml-1 rounded" />
          </div>
        </span>

        <div className="flex justify-between w-full">
          <Skeleton className="h-4 w-[70px] lg:w-[90px] rounded" />
          <Skeleton className="h-4 w-[100px] lg:w-[140px] rounded" />
        </div>

        <div className="w-full flex flex-row-reverse justify-between items-center">
          <Skeleton className="w-5 h-5 rounded" />
          <div className="flex flex-row justify-between items-center">
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <Skeleton className="w-[110px] h-[32px] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const MenuFoodCardsSkeleton = () => {
  const skeletonItems = Array(8).fill(null);
  return (
    <div className="flex flex-row flex-wrap justify-end gap-1 max-w-[1350px] px-[5%] mx-auto">
      {skeletonItems.map((_, index) => (
        <MenuFoodCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const CartAddressCard = () => {
  return (
    <div className="cursor-pointer flex flex-col gap-3 justify-between border border-gray-300 items-end duration-150 rounded-md sm:w-[45%] px-4 py-2">
      <div className="w-full flex flex-row-reverse gap-2">
        <Skeleton className="w-full h-4" />
        <div className="flex flex-row gap-1">
          <Skeleton className="w-6 h-6 rounded-full" />{" "}
          <Skeleton className="w-6 h-6 rounded-full" />{" "}
        </div>
      </div>
      <div className="w-full flex flex-row-reverse items-center justify-between">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-1/3 h-3" />
      </div>
    </div>
  );
};

export const CartAddressCards = () => {
  const skeletonItems = Array(4).fill(null);
  return (
    <div>
      {skeletonItems.map((_, index) => (
        <CartAddressCard key={index} />
      ))}
    </div>
  );
};

export const OrderCardSkeleton = () => {
  return (
    <div className="border rounded shadow p-4 w-full flex flex-col gap-3 bg-gray-50">
      {/* Header */}
      <div className="w-full flex flex-row-reverse items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-row-reverse items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-row-reverse items-center justify-center sm:justify-between flex-wrap gap-2">
        <div className="w-full sm:w-max flex flex-row-reverse items-center gap-2">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="w-full sm:w-max flex flex-row-reverse items-center gap-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="w-full sm:w-max flex flex-row-reverse items-center gap-2">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Address */}
      <div className="text-right text-sm text-gray-800 flex flex-row-reverse gap-2">
        <Skeleton className="h-4 w-36" />
      </div>

      {/* Status Timeline */}
      <div className="w-full flex flex-row-reverse items-center justify-center my-4">
        <div className="flex-1 flex flex-row items-center gap-1">
          <Skeleton className="w-full h-1 rounded" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
        <div className="flex-1 flex flex-row items-center gap-1">
          <Skeleton className="w-full h-1 rounded" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
        <div className="flex-1 flex flex-row items-center gap-1">
          <Skeleton className="w-full h-1 rounded" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </div>

      {/* Food Items */}
      <div className="flex flex-row-reverse gap-2 items-center overflow-x-auto py-2">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="food-item w-[150px] min-w-[150px] border rounded-md flex flex-col items-center bg-white pb-1"
          >
            <Skeleton className="w-[140px] h-[100px] mt-1 rounded object-cover" />
            <Skeleton className="h-4 w-24 mt-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="mt-4 flex flex-row w-full items-center gap-2">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
};

export const OrderCardsSkeleton = () => {
  const skeletonItems = Array(4).fill(null);
  return (
    <section className="w-full max-w-[1350px] min-h-[510px] my-2 px-[5%] mx-auto">
      <div className="w-full flex flex-row-reverse flex-wrap gap-2">
        {skeletonItems.map((_, index) => (
          <OrderCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
};
