import { BranchReviewSkeleton } from "@/components/skeleton";
import BranchReview from "./components/branch-review";
import FoodSlidersByType from "./components/card-slider";
import { Suspense } from "react";

interface BranchPageProps {
  params: Promise<{ id: string }>;
}

const BranchPage: React.FC<BranchPageProps> = async ({ params }) => {
  const resolvedParams = await params;
  return (
    <div>
      <FoodSlidersByType />
      <Suspense fallback={<BranchReviewSkeleton />}>
        <BranchReview  />
      </Suspense>
    </div>
  );
};

export default BranchPage;
