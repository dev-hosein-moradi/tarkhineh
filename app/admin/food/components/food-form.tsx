"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createFood, updateFood } from "@/services/food-service";
import { toast } from "sonner";
import NextCloudinaryUploader from "@/components/NextCloudinaryUploader";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

type FoodFormProps = {
  food?: any;
  onSuccess: () => void;
};

export default function FoodForm({ food, onSuccess }: FoodFormProps) {
  const [form, setForm] = useState(
    food || {
      name: "",
      compounds: "",
      type: "",
      tag: "",
      rate: 0,
      percentOfDiscount: 0,
      discountPrice: "",
      mainPrice: "",
      isFavorite: false,
      numOfScore: 0,
      image: "",
    }
  );
  const [loading, setLoading] = useState(false);

  // Helper function to format numbers with thousand separators
  const formatNumber = (value: string): string => {
    if (!value) return "";
    // Remove all non-digit characters except spaces
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    // Add thousand separators every 3 digits from right
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Helper function to remove formatting and get raw number
  const unformatNumber = (value: string): string => {
    return value.replace(/\s/g, "");
  };

  // Calculate discount price based on main price and discount percentage
  const calculateDiscountPrice = (
    mainPrice: string,
    discountPercent: number
  ): string => {
    const rawMainPrice = unformatNumber(mainPrice);
    if (!rawMainPrice || !discountPercent || discountPercent <= 0) return "";

    const numericMainPrice = Number(rawMainPrice);
    if (isNaN(numericMainPrice)) return "";

    const discountAmount = (numericMainPrice * discountPercent) / 100;
    const discountPrice = numericMainPrice - discountAmount;

    return formatNumber(Math.round(discountPrice).toString());
  };

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev: any) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "mainPrice") {
      // Allow only digits and format on blur or when complete
      const numericOnly = value.replace(/[^\d]/g, "");
      const formattedValue = formatNumber(numericOnly);

      const updatedForm = {
        ...form,
        [name]: formattedValue,
      };

      // Recalculate discount price if discount percentage exists
      if (form.percentOfDiscount > 0) {
        updatedForm.discountPrice = calculateDiscountPrice(
          formattedValue,
          form.percentOfDiscount
        );
      }

      setForm(updatedForm);
    } else if (name === "percentOfDiscount") {
      const numericValue = Math.max(0, Math.min(100, Number(value) || 0));
      const updatedForm = {
        ...form,
        [name]: numericValue,
      };

      // Calculate discount price based on main price and new discount percentage
      if (form.mainPrice && numericValue > 0) {
        updatedForm.discountPrice = calculateDiscountPrice(
          form.mainPrice,
          numericValue
        );
      } else {
        updatedForm.discountPrice = "";
      }

      setForm(updatedForm);
    } else if (type === "number") {
      setForm((prev: any) => ({
        ...prev,
        [name]: Number(value) || 0,
      }));
    } else {
      setForm((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare data for backend - remove formatting from price fields
      const submitData = {
        ...form,
        mainPrice: unformatNumber(form.mainPrice),
        discountPrice: unformatNumber(form.discountPrice),
      };

      if (food && food.id) {
        await updateFood(food.id, submitData);
        toast.success("غذا با موفقیت ویرایش شد.");
      } else {
        await createFood(submitData);
        toast.success("غذای جدید با موفقیت ثبت شد.");
      }
      onSuccess();
    } catch (err) {
      toast.error("مشکلی در ثبت یا ویرایش غذا رخ داد.");
    }
    setLoading(false);
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
            placeholder="نام غذا"
            required
          />
          <Input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="نوع غذا"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="برچسب"
            required
          />
          <Input
            name="compounds"
            value={form.compounds}
            onChange={handleChange}
            placeholder="مواد تشکیل دهنده"
            required
          />
        </div>
      </div>

      {/* Price Information Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">اطلاعات قیمت</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Input
              name="mainPrice"
              value={form.mainPrice}
              onChange={handleChange}
              placeholder="قیمت اصلی"
              required
              className="text-left"
              dir="ltr"
              style={{ textAlign: "left", direction: "ltr" }}
            />
            <span className="text-xs text-gray-500">تومان</span>
          </div>

          <div className="space-y-1">
            <Input
              name="percentOfDiscount"
              type="number"
              value={form.percentOfDiscount}
              onChange={handleChange}
              placeholder="درصد تخفیف"
              min="0"
              max="100"
              className="text-left"
              dir="ltr"
            />
            <span className="text-xs text-gray-500">تخفیف بین 0 تا 100</span>
          </div>

          <div className="space-y-1">
            <Input
              name="discountPrice"
              value={form.discountPrice}
              placeholder="قیمت با تخفیف"
              readOnly
              className="bg-gray-50 cursor-not-allowed text-left"
              dir="ltr"
              style={{ textAlign: "left", direction: "ltr" }}
            />
            <span className="text-xs text-gray-500">محاسبه خودکار</span>
          </div>
        </div>

        {/* Price calculation info */}
        {form.mainPrice && form.percentOfDiscount > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="text-blue-800">
              قیمت اصلی:{" "}
              <span className="font-semibold" dir="ltr">
                {form.mainPrice} تومان
              </span>
            </p>
            <p className="text-blue-800">
              تخفیف:{" "}
              <span className="font-semibold">{form.percentOfDiscount}%</span>
            </p>
            <p className="text-blue-800">
              قیمت نهایی:{" "}
              <span className="font-semibold" dir="ltr">
                {form.discountPrice} تومان
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Rating Information Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">اطلاعات امتیاز</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Input
              name="rate"
              type="number"
              step="0.1"
              value={form.rate}
              onChange={handleChange}
              placeholder="امتیاز (0-5)"
              min="0"
              max="5"
              className="text-left"
              dir="ltr"
            />
            <span className="text-xs text-gray-500">امتیاز اولیه غذا</span>
          </div>

          {/* Display numOfScore as read-only info */}
          <div className="space-y-1">
            <Input
              name="numOfScore"
              type="number"
              value={form.numOfScore}
              placeholder="تعداد امتیاز دهندگان"
              readOnly
              className="bg-gray-50 cursor-not-allowed text-left"
              dir="ltr"
            />
            <span className="text-xs text-gray-500">
              محاسبه خودکار توسط سیستم
            </span>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">تصویر غذا</h2>
        <NextCloudinaryUploader
          uploadPreset="yefgbqyx"
          folder="food-images"
          maxFiles={1}
          multiple={false}
          onUploadSuccess={handleImageUploadSuccess}
          onUploadError={handleImageUploadError}
        />
        {form.image && (
          <div className="mt-4">
            <img
              src={form.image}
              alt="food preview"
              className="w-48 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">ویژگی‌ها</h2>
        <div className="flex items-center gap-2">
          <Checkbox
            name="isFavorite"
            checked={form.isFavorite}
            onCheckedChange={(checked) =>
              setForm((prev: any) => ({
                ...prev,
                isFavorite: checked,
              }))
            }
          />
          <span>غذای محبوب</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <Button
          className="bg-main w-full md:w-auto"
          type="submit"
          disabled={loading}
        >
          {loading ? "در حال پردازش..." : food ? "ویرایش غذا" : "ثبت غذا"}
        </Button>
      </div>
    </form>
  );
}
