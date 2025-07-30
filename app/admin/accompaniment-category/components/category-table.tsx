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
import { getAccompanimentCategories } from "@/services/accompaniment-service";
import { IAccompanimentCategory } from "@/types";

interface CategoryTableProps {
  onEdit: (category: IAccompanimentCategory) => void;
  onDelete: (category: IAccompanimentCategory) => void;
  onView: (category: IAccompanimentCategory) => void;
}

interface CategoryTableRef {
  refreshTable: () => void;
}

const CategoryTable = forwardRef<CategoryTableRef, CategoryTableProps>(
  ({ onEdit, onDelete, onView }, ref) => {
    const [categories, setCategories] = useState<IAccompanimentCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = () => {
      setLoading(true);
      setError(null);
      getAccompanimentCategories()
        .then((data) => {
          if (data) {
            setCategories(data);
          } else {
            setCategories([]);
            setError("خطا در دریافت اطلاعات دسته‌بندی‌ها");
          }
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
          setError("خطا در دریافت اطلاعات دسته‌بندی‌ها");
          setCategories([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchCategories();
    }, []);

    // Expose refreshTable function to parent component via ref
    useImperativeHandle(ref, () => ({
      refreshTable: fetchCategories,
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
          <Button onClick={fetchCategories} variant="outline">
            تلاش مجدد
          </Button>
        </div>
      );
    }

    return (
      <div dir="rtl" className="w-full">
        {categories.length === 0 ? (
          <div className="w-full flex justify-center items-center py-8">
            <p className="text-gray-500">هیچ دسته‌بندی یافت نشد</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام انگلیسی</TableHead>
                <TableHead className="text-right">عنوان فارسی</TableHead>
                <TableHead className="text-right">تصویر</TableHead>
                <TableHead className="text-right">تاریخ ایجاد</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="text-right">{category.name}</TableCell>
                  <TableCell className="text-right">{category.title}</TableCell>
                  <TableCell className="text-right">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">بدون تصویر</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString("fa-IR")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-center">
                      <Button
                        className="bg-gray-100 text-black border-gray-200 border-2 hover:bg-gray-200"
                        size="icon"
                        onClick={() => onView(category)}
                        title="مشاهده"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        className="bg-blue-100 text-blue-800 border-blue-200 border-2 hover:bg-blue-200"
                        size="icon"
                        onClick={() => onEdit(category)}
                        title="ویرایش"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="bg-red-100 text-red-800 border-red-200 border-2 hover:bg-red-200"
                        size="icon"
                        onClick={() => onDelete(category)}
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
  }
);

CategoryTable.displayName = "CategoryTable";

export default CategoryTable;
