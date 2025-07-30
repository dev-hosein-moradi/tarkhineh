"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createAccompanimentCategory,
  updateAccompanimentCategory,
} from "@/services/accompaniment-service";
import { toast } from "sonner";
import NextCloudinaryUploader from "@/components/NextCloudinaryUploader";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

type CategoryFormProps = {
  category?: any;
  onSuccess: () => void;
};

export default function CategoryForm({
  category,
  onSuccess,
}: CategoryFormProps) {
  const [form, setForm] = useState(
    category || {
      name: "",
      title: "",
      image: "",
    }
  );
  const [loading, setLoading] = useState(false);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }

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

    const apiCall =
      category && category.id
        ? updateAccompanimentCategory(category.id, form)
        : createAccompanimentCategory(form);

    apiCall
      .then(() => {
        toast.success(
          category && category.id
            ? "دسته‌بندی با موفقیت ویرایش شد."
            : "دسته‌بندی جدید با موفقیت ثبت شد."
        );
        onSuccess();
      })
      .catch((err) => {
        console.error("Submit error:", err);
        toast.error("مشکلی در ثبت یا ویرایش دسته‌بندی رخ داد.");
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
            placeholder="نام انگلیسی (drink, salad, dessert)"
            required
          />
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="عنوان فارسی (نوشیدنی، سالاد، دسر)"
            required
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">تصویر</h2>
        <NextCloudinaryUploader
          uploadPreset="yefgbqyx"
          folder="accompaniment-category-images"
          maxFiles={1}
          multiple={false}
          onUploadSuccess={handleImageUploadSuccess}
          onUploadError={handleImageUploadError}
        />
        {form.image && (
          <div className="mt-4">
            <img
              src={form.image}
              alt="category preview"
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
            : category && category.id
            ? "ویرایش دسته‌بندی"
            : "ثبت دسته‌بندی"}
        </Button>
      </div>
    </form>
  );
}
