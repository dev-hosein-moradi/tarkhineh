import { BranchReviewSkeleton } from "@/components/skeleton";
import BranchReview from "./components/branch-review";
import FoodSlidersByType from "./components/card-slider";
import { Suspense } from "react";

interface BranchPageProps {
  params: { branchId: string };
}

const BranchPage: React.FC<BranchPageProps> = ({ params }) => {
  return (
    <div>
      <FoodSlidersByType />
      <Suspense fallback={<BranchReviewSkeleton />}>
        <BranchReview params={params} />
      </Suspense>
    </div>
  );
};

export default BranchPage;
