import { BranchReviewSkeleton } from "@/components/skeleton";
import { Suspense } from "react";

interface MenuPageProps {
  params: { id: string };
}

const MenuPage: React.FC<MenuPageProps> = ({ params }) => {
  return <div>hello menu page</div>;
};

export default MenuPage;
