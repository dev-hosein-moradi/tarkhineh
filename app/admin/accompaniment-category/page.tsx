"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CategoryTable from "./components/category-table";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteAccompanimentCategory } from "@/services/accompaniment-service";
import { toast } from "sonner";
import { IAccompanimentCategory } from "@/types";

// Define the ref type
interface CategoryTableRef {
  refreshTable: () => void;
}

export default function AccompanimentCategoryPage() {
  const router = useRouter();
  const [deleteCategoryData, setDeleteCategoryData] =
    useState<IAccompanimentCategory | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const tableRef = useRef<CategoryTableRef>(null);

  const handleDeleteConfirm = () => {
    if (!deleteCategoryData?.id) return;

    setDeleteLoading(true);
    deleteAccompanimentCategory(deleteCategoryData.id)
      .then(() => {
        toast.success("دسته‌بندی با موفقیت حذف شد");
        setDeleteOpen(false);
        setDeleteCategoryData(null);
        tableRef.current?.refreshTable();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("خطا در حذف دسته‌بندی");
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const handleAddCategory = () => {
    router.push("/admin/accompaniment-category/form");
  };

  const handleEditCategory = (category: IAccompanimentCategory) => {
    router.push(`/admin/accompaniment-category/form?id=${category.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">دسته‌بندی اقلام جانبی</h1>
        <Button className="bg-main" onClick={handleAddCategory}>
          افزودن دسته‌بندی
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <CategoryTable
          ref={tableRef}
          onEdit={handleEditCategory}
          onDelete={(category) => {
            setDeleteCategoryData(category);
            setDeleteOpen(true);
          }}
          onView={(category) => {
            console.log("View category:", category);
            toast.info(`مشاهده دسته‌بندی: ${category.title}`);
          }}
        />
      </div>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteCategoryData(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
