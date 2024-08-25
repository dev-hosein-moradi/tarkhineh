"use client";

import Link from "next/link";
import { MdBrnach } from "./branch-card";
import { useBranchStore } from "@/hooks/use-branch";
import { useEffect } from "react";
import { MdBranchCardsSkeleton } from "./skeleton";

export default function Branchs() {
  const { branches, fetchBranches } = useBranchStore();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  if (branches?.length == 0) {
    return <MdBranchCardsSkeleton />;
  }
  return (
    <div className="flex flex-row-reverse flex-wrap w-full min-h-[400px] items-center justify-center py-5">
      {branches?.map((branch) => (
        <Link key={branch.id} href={`/branch/${branch.id}`}>
          <MdBrnach data={branch} className="" />
        </Link>
      ))}
    </div>
  );
}
