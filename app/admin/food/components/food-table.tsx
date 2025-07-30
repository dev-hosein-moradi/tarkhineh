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
import { getFoods } from "@/services/food-service";
import { IFood } from "@/types";

interface FoodTableProps {
  onEdit: (food: IFood) => void;
  onDelete: (food: IFood) => void;
  onView: (food: IFood) => void;
}

interface FoodTableRef {
  refreshTable: () => void;
}

const FoodTable = forwardRef<FoodTableRef, FoodTableProps>(
  ({ onEdit, onDelete, onView }, ref) => {
    const [foods, setFoods] = useState<IFood[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFoods();
        if (data) {
          setFoods(data);
        } else {
          setFoods([]);
          setError("خطا در دریافت اطلاعات غذاها");
        }
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError("خطا در دریافت اطلاعات غذاها");
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchFoods();
    }, []);

    // Expose refreshTable function to parent component via ref
    useImperativeHandle(ref, () => ({
      refreshTable: fetchFoods,
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
          <Button onClick={fetchFoods} variant="outline">
            تلاش مجدد
          </Button>
        </div>
      );
    }

    return (
      <div dir="rtl" className="w-full">
        {foods.length === 0 ? (
          <div className="w-full flex justify-center items-center py-8">
            <p className="text-gray-500">هیچ غذایی یافت نشد</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام غذا</TableHead>
                <TableHead className="text-right">نوع</TableHead>
                <TableHead className="text-right">قیمت اصلی</TableHead>
                <TableHead className="text-right">قیمت با تخفیف</TableHead>
                <TableHead className="text-right">درصد تخفیف</TableHead>
                <TableHead className="text-right">محبوب</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foods.map((food) => (
                <TableRow key={food.id}>
                  <TableCell className="text-right">{food.name}</TableCell>
                  <TableCell className="text-right">{food.type}</TableCell>
                  <TableCell className="text-right">{food.mainPrice}</TableCell>
                  <TableCell className="text-right">
                    {food.discountPrice}
                  </TableCell>
                  <TableCell className="text-right">
                    {food.percentOfDiscount}%
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        food.isFavorite
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {food.isFavorite ? "محبوب" : "عادی"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-center">
                      <Button
                        className="bg-gray-100 text-black border-gray-200 border-2 hover:bg-gray-200"
                        size="icon"
                        onClick={() => onView(food)}
                        title="مشاهده"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        className="bg-blue-100 text-blue-800 border-blue-200 border-2 hover:bg-blue-200"
                        size="icon"
                        onClick={() => onEdit(food)}
                        title="ویرایش"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="bg-red-100 text-red-800 border-red-200 border-2 hover:bg-red-200"
                        size="icon"
                        onClick={() => onDelete(food)}
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

FoodTable.displayName = "FoodTable";

export default FoodTable;
