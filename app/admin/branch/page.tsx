"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BranchTable from "./components/branch-table";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteBranch } from "@/services/branch-service";
import { toast } from "sonner";
import { IBranch } from "@/types";

export default function BranchPage() {
  const router = useRouter();
  const [deleteBranchData, setDeleteBranchData] = useState<IBranch | null>(
    null
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const tableRef = useRef<any>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteBranchData?.id) return;

    setDeleteLoading(true);
    try {
      await deleteBranch(deleteBranchData.id);
      toast.success("شعبه با موفقیت حذف شد");
      setDeleteOpen(false);
      setDeleteBranchData(null);
      // Refresh the table after successful delete
      if (tableRef.current?.refreshTable) {
        tableRef.current.refreshTable();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("خطا در حذف شعبه");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddBranch = () => {
    router.push("/admin/branch/form");
  };

  const handleEditBranch = (branch: IBranch) => {
    router.push(`/admin/branch/form?id=${branch.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-between py-[16px] px-[5%] relative max-w-[1350px] mx-auto">
      <div className="w-full flex flex-row-reverse justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">شعبه ها</h1>
        <Button className="bg-main" onClick={handleAddBranch}>
          افزودن شعبه
        </Button>
      </div>

      <BranchTable
        ref={tableRef}
        onEdit={handleEditBranch}
        onDelete={(branch) => {
          setDeleteBranchData(branch);
          setDeleteOpen(true);
        }}
        onView={(branch) => {
          // You can navigate to a view page or show details inline
          console.log("View branch:", branch);
          // For now, let's just show branch details in a toast
          toast.info(`مشاهده شعبه: ${branch.name}`);
        }}
      />

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteBranchData(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
