"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FoodTable from "./components/food-table";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteFood } from "@/services/food-service";
import { toast } from "sonner";
import { IFood } from "@/types";

// Define the ref type
interface FoodTableRef {
  refreshTable: () => void;
}

export default function FoodPage() {
  const router = useRouter();
  const [deleteFoodData, setDeleteFoodData] = useState<IFood | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const tableRef = useRef<FoodTableRef>(null);

  const handleDeleteConfirm = () => {
    if (!deleteFoodData?.id) return;

    setDeleteLoading(true);
    deleteFood(deleteFoodData.id)
      .then(() => {
        toast.success("غذا با موفقیت حذف شد");
        setDeleteOpen(false);
        setDeleteFoodData(null);
        tableRef.current?.refreshTable();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("خطا در حذف غذا");
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const handleAddFood = () => {
    router.push("/admin/food/form");
  };

  const handleEditFood = (food: IFood) => {
    router.push(`/admin/food/form?id=${food.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">غذاها</h1>
        <Button className="bg-main" onClick={handleAddFood}>
          افزودن غذا
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <FoodTable
          ref={tableRef}
          onEdit={handleEditFood}
          onDelete={(food) => {
            setDeleteFoodData(food);
            setDeleteOpen(true);
          }}
          onView={(food) => {
            console.log("View food:", food);
            toast.info(`مشاهده غذا: ${food.name}`);
          }}
        />
      </div>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteFoodData(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
