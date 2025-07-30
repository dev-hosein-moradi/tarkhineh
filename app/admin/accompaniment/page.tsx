"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AccompanimentTable from "./components/accompaniment-table";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteAccompaniment } from "@/services/accompaniment-service";
import { toast } from "sonner";
import { IAccompaniment } from "@/types";

// Define the ref type
interface AccompanimentTableRef {
  refreshTable: () => void;
}

export default function AccompanimentPage() {
  const router = useRouter();
  const [deleteAccompanimentData, setDeleteAccompanimentData] =
    useState<IAccompaniment | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const tableRef = useRef<AccompanimentTableRef>(null);

  const handleDeleteConfirm = () => {
    if (!deleteAccompanimentData?.id) return;

    setDeleteLoading(true);
    deleteAccompaniment(deleteAccompanimentData.id)
      .then(() => {
        toast.success("اقلام جانبی با موفقیت حذف شد");
        setDeleteOpen(false);
        setDeleteAccompanimentData(null);
        tableRef.current?.refreshTable();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("خطا در حذف اقلام جانبی");
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const handleAddAccompaniment = () => {
    router.push("/admin/accompaniment/form");
  };

  const handleEditAccompaniment = (accompaniment: IAccompaniment) => {
    router.push(`/admin/accompaniment/form?id=${accompaniment.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">اقلام جانبی</h1>
        <Button className="bg-main" onClick={handleAddAccompaniment}>
          افزودن اقلام جانبی
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <AccompanimentTable
          ref={tableRef}
          onEdit={handleEditAccompaniment}
          onDelete={(accompaniment) => {
            setDeleteAccompanimentData(accompaniment);
            setDeleteOpen(true);
          }}
          onView={(accompaniment) => {
            console.log("View accompaniment:", accompaniment);
            toast.info(`مشاهده اقلام جانبی: ${accompaniment.name}`);
          }}
        />
      </div>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteAccompanimentData(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
