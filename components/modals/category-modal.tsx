"use client";

import { Modal } from "@/components/ui/modal";
import { useBranchStore } from "@/hooks/use-branch";
import { useCategoryModal } from "@/hooks/use-category-modal";
import { Suspense, useEffect } from "react";
import { MdBranchCardsSkeleton, SmBranchCardsSkeleton } from "../skeleton";
import { SmBrnach } from "../branch-card";
import Link from "next/link";

export const CategoryModal = () => {
  const categoryModal = useCategoryModal();
  const { branches, fetchBranches } = useBranchStore();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return (
    <Modal
      title="شعبه"
      description="لطفا شعبه مورد نظر را انتخاب کنید"
      isOpen={categoryModal.isOpen}
      onClose={categoryModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4 flex-col text-right" dir="ltr">
          <Suspense fallback={<SmBranchCardsSkeleton />}>
            {branches?.map((branch) => (
              <Link
                key={branch.id}
                href={`/branch/${branch.id}`}
                onClick={categoryModal.onClose}
              >
                <SmBrnach data={branch} className="" />
              </Link>
            ))}
          </Suspense>
        </div>
      </div>
    </Modal>
  );
};
