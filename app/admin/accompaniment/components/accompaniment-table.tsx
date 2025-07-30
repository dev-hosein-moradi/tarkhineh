"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, RefreshCw } from "lucide-react";
import { getAccompaniments } from "@/services/accompaniment-service";
import { IAccompaniment } from "@/types";

interface AccompanimentTableProps {
  onEdit: (accompaniment: IAccompaniment) => void;
  onDelete: (accompaniment: IAccompaniment) => void;
  onView: (accompaniment: IAccompaniment) => void;
}

interface AccompanimentTableRef {
  refreshTable: () => void;
}

const AccompanimentTable = forwardRef<
  AccompanimentTableRef,
  AccompanimentTableProps
>(({ onEdit, onDelete, onView }, ref) => {
  const [accompaniments, setAccompaniments] = useState<IAccompaniment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccompaniments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAccompaniments();
      if (data) {
        setAccompaniments(data);
      } else {
        setAccompaniments([]);
        setError("خطا در دریافت اطلاعات اقلام جانبی");
      }
    } catch (err) {
      console.error("Error fetching accompaniments:", err);
      setError("خطا در دریافت اطلاعات اقلام جانبی");
      setAccompaniments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccompaniments();
  }, []);

  // Expose refreshTable function to parent component via ref
  useImperativeHandle(ref, () => ({
    refreshTable: fetchAccompaniments,
  }));

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-8" dir="rtl">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full flex flex-col justify-center items-center py-8"
        dir="rtl"
      >
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchAccompaniments} variant="outline">
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="w-full">
      {accompaniments.length === 0 ? (
        <div className="w-full flex justify-center items-center py-8">
          <p className="text-gray-500">هیچ اقلام جانبی یافت نشد</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">نام</TableHead>
              <TableHead className="text-right">دسته‌بندی</TableHead>
              <TableHead className="text-right">قیمت</TableHead>
              <TableHead className="text-right">موجود</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accompaniments.map((accompaniment) => (
              <TableRow key={accompaniment.id}>
                <TableCell className="text-right">
                  {accompaniment.name}
                </TableCell>
                <TableCell className="text-right">
                  {accompaniment.category?.title || "نامشخص"}
                </TableCell>
                <TableCell className="text-right" dir="ltr">
                  {accompaniment.price}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      accompaniment.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {accompaniment.available ? "موجود" : "ناموجود"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-center">
                    <Button
                      className="bg-gray-100 text-black border-gray-200 border-2 hover:bg-gray-200"
                      size="icon"
                      onClick={() => onView(accompaniment)}
                      title="مشاهده"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      className="bg-blue-100 text-blue-800 border-blue-200 border-2 hover:bg-blue-200"
                      size="icon"
                      onClick={() => onEdit(accompaniment)}
                      title="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      className="bg-red-100 text-red-800 border-red-200 border-2 hover:bg-red-200"
                      size="icon"
                      onClick={() => onDelete(accompaniment)}
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
});

AccompanimentTable.displayName = "AccompanimentTable";

export default AccompanimentTable;
