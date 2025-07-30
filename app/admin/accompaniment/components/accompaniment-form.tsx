"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createAccompaniment,
  updateAccompaniment,
  getAccompanimentCategories,
} from "@/services/accompaniment-service";
import { toast } from "sonner";
import NextCloudinaryUploader from "@/components/NextCloudinaryUploader";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { IAccompanimentCategory } from "@/types";

type AccompanimentFormProps = {
  accompaniment?: any;
  onSuccess: () => void;
};

export default function AccompanimentForm({
  accompaniment,
  onSuccess,
}: AccompanimentFormProps) {
  const [form, setForm] = useState(
    accompaniment || {
      name: "",
      categoryId: "",
      price: "",
      image: "",
      description: "",
      available: true,
    }
  );
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IAccompanimentCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Helper function to format numbers with thousand separators
  const formatNumber = (value: string): string => {
    if (!value) return "";
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    // Add thousand separators every 3 digits from right
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Helper function to remove formatting and get raw number
  const unformatNumber = (value: string): string => {
    return value.replace(/\s/g, "");
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = () => {
      setCategoriesLoading(true);
      getAccompanimentCategories()
        .then((data) => {
          if (data && Array.isArray(data)) {
            // Filter out any categories with empty or invalid IDs
            const validCategories = data.filter(
              (category) =>
                category &&
                category.id &&
                category.id.trim() !== "" &&
                category.title
            );
            setCategories(validCategories);
          } else {
            setCategories([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          toast.error("خطا در دریافت دسته‌بندی‌ها");
          setCategories([]);
        })
        .finally(() => {
          setCategoriesLoading(false);
        });
    };

    fetchCategories();
  }, []);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev: any) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "price") {
      // Format price with thousand separators
      const numericOnly = value.replace(/[^\d]/g, "");
      const formattedValue = formatNumber(numericOnly);

      setForm((prev: any) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setForm((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  const handleCategoryChange = (value: string) => {
    setForm((prev: any) => ({
      ...prev,
      categoryId: value,
    }));
  };

  const handleImageUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.info &&
      typeof result.info === "object" &&
      "secure_url" in result.info
    ) {
      setForm((prev: any) => ({
        ...prev,
        image: (result.info as any).secure_url,
      }));
      toast.success("تصویر با موفقیت آپلود شد.");
    }
  };

  const handleImageUploadError = (error: any) => {
    toast.error("خطا در آپلود تصویر: " + error.message);
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    // Prepare data for backend - remove formatting from price
    const submitData = {
      ...form,
      price: unformatNumber(form.price),
    };

    const apiCall =
      accompaniment && accompaniment.id
        ? updateAccompaniment(accompaniment.id, submitData)
        : createAccompaniment(submitData);

    apiCall
      .then(() => {
        toast.success(
          accompaniment && accompaniment.id
            ? "اقلام جانبی با موفقیت ویرایش شد."
            : "اقلام جانبی جدید با موفقیت ثبت شد."
        );
        onSuccess();
      })
      .catch((err) => {
        console.error("Submit error:", err);
        toast.error("مشکلی در ثبت یا ویرایش اقلام جانبی رخ داد.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form className="space-y-6 text-right" dir="rtl" onSubmit={handleSubmit}>
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">اطلاعات پایه</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="نام اقلام جانبی"
            required
          />

          <div>
            <Select
              dir="rtl"
              value={form.categoryId || ""}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    در حال بارگذاری...
                  </SelectItem>
                ) : categories.length === 0 ? (
                  <SelectItem value="no-categories" disabled>
                    هیچ دسته‌بندی یافت نشد
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id || ""}>
                      {category.title || category.name || "نامشخص"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="قیمت"
              required
              className="text-left"
              dir="ltr"
              style={{ textAlign: "left", direction: "ltr" }}
            />
            <span className="text-xs text-gray-500">تومان</span>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              name="available"
              checked={form.available}
              onCheckedChange={(checked) =>
                setForm((prev: any) => ({
                  ...prev,
                  available: checked,
                }))
              }
            />
            <span>موجود</span>
          </div>
        </div>

        <div>
          <Textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            placeholder="توضیحات (اختیاری)"
            rows={3}
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">تصویر</h2>
        <NextCloudinaryUploader
          uploadPreset="yefgbqyx"
          folder="accompaniment-images"
          maxFiles={1}
          multiple={false}
          onUploadSuccess={handleImageUploadSuccess}
          onUploadError={handleImageUploadError}
        />
        {form.image && (
          <div className="mt-4">
            <img
              src={form.image}
              alt="accompaniment preview"
              className="w-48 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <Button
          className="bg-main w-full md:w-auto"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "در حال پردازش..."
            : accompaniment && accompaniment.id
            ? "ویرایش اقلام جانبی"
            : "ثبت اقلام جانبی"}
        </Button>
      </div>
    </form>
  );
}
