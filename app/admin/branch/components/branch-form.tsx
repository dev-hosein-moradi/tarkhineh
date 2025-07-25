"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createBranch, updateBranch } from "@/services/branch-service";
import { toast } from "sonner";
import NextCloudinaryUploader from "@/components/NextCloudinaryUploader";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

type BranchFormProps = {
  branch?: any;
  onSuccess: () => void;
};

export default function BranchForm({ branch, onSuccess }: BranchFormProps) {
  console.log(branch);

  const [form, setForm] = useState(
    branch || {
      name: "",
      title: "",
      address: "",
      ownerFullName: "",
      ownerNatCode: "",
      ownerPhone: "",
      ownerState: "",
      ownerCity: "",
      ownerRegion: "",
      ownerAddress: "",
      ownerType: "",
      placeArea: "",
      placeAge: "",
      verification: false,
      kitchen: false,
      parking: false,
      store: false,
      image: "",
      workTime: "",
      tel: [],
    }
  );
  const [loading, setLoading] = useState(false);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      if (branch && branch.id) {
        await updateBranch(branch.id, form);
        toast.success("شعبه با موفقیت ویرایش شد.");
      } else {
        await createBranch(form);
        toast.success("شعبه جدید با موفقیت ثبت شد.");
      }
      onSuccess();
    } catch (err) {
      toast.error("مشکلی در ثبت یا ویرایش شعبه رخ داد.");
    }
    setLoading(false);
  }

  return (
    <form
      className="space-y-6 text-right" // Removed max-height and overflow
      dir="rtl"
      onSubmit={handleSubmit}
    >
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">اطلاعات پایه</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="نام شعبه"
            required
          />
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="عنوان شعبه"
            required
          />
        </div>
        <Input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="آدرس شعبه"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="tel1"
            value={form?.tel[0] || ""}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                tel: [e.target.value, prev.tel[1] || ""],
              }))
            }
            placeholder="تلفن ۱"
            required
          />
          <Input
            name="tel2"
            value={form?.tel[1] || ""}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                tel: [prev.tel[0] || "", e.target.value],
              }))
            }
            placeholder="تلفن ۲"
            required
          />
        </div>
        <Input
          name="workTime"
          value={form.workTime}
          onChange={handleChange}
          placeholder="ساعات کاری"
          required
        />
      </div>

      {/* Owner Information Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">اطلاعات مالک</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="ownerFullName"
            value={form.ownerFullName}
            onChange={handleChange}
            placeholder="نام مالک"
            required
          />
          <Input
            name="ownerNatCode"
            value={form.ownerNatCode}
            onChange={handleChange}
            placeholder="کد ملی مالک"
            required
          />
          <Input
            name="ownerPhone"
            value={form.ownerPhone}
            onChange={handleChange}
            placeholder="شماره تلفن مالک"
            required
          />
          <Input
            name="ownerType"
            value={form.ownerType}
            onChange={handleChange}
            placeholder="نوع مالک"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="ownerState"
            value={form.ownerState}
            onChange={handleChange}
            placeholder="استان مالک"
            required
          />
          <Input
            name="ownerCity"
            value={form.ownerCity}
            onChange={handleChange}
            placeholder="شهر مالک"
            required
          />
          <Input
            name="ownerRegion"
            value={form.ownerRegion}
            onChange={handleChange}
            placeholder="منطقه مالک"
            required
          />
        </div>
        <Input
          name="ownerAddress"
          value={form.ownerAddress}
          onChange={handleChange}
          placeholder="آدرس مالک"
          required
        />
      </div>

      {/* Place Information Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">مشخصات محل</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="placeArea"
            value={form.placeArea}
            onChange={handleChange}
            placeholder="متراژ محل"
            required
          />
          <Input
            name="placeAge"
            value={form.placeAge}
            onChange={handleChange}
            placeholder="سن بنا"
            required
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">تصویر شعبه</h2>
        <NextCloudinaryUploader
          uploadPreset="yefgbqyx"
          folder="tarkhineh"
          maxFiles={1}
          multiple={false}
          onUploadSuccess={handleImageUploadSuccess}
          onUploadError={handleImageUploadError}
        />
        {form.image && (
          <div className="mt-4">
            <img
              src={form.image}
              alt="branch preview"
              className="w-48 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">امکانات</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              name="verification"
              checked={form.verification}
              onCheckedChange={(checked) =>
                setForm((prev: any) => ({
                  ...prev,
                  verification: checked,
                }))
              }
            />
            <span>تایید شده</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              name="kitchen"
              checked={form.kitchen}
              onCheckedChange={(checked) =>
                setForm((prev: any) => ({
                  ...prev,
                  kitchen: checked,
                }))
              }
            />
            <span>آشپزخانه</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              name="parking"
              checked={form.parking}
              onCheckedChange={(checked) =>
                setForm((prev: any) => ({
                  ...prev,
                  parking: checked,
                }))
              }
            />
            <span>پارکینگ</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              name="store"
              checked={form.store}
              onCheckedChange={(checked) =>
                setForm((prev: any) => ({
                  ...prev,
                  store: checked,
                }))
              }
            />
            <span>انبار</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <Button
          className="bg-main w-full md:w-auto"
          type="submit"
          disabled={loading}
        >
          {loading ? "در حال پردازش..." : branch ? "ویرایش شعبه" : "ثبت شعبه"}
        </Button>
      </div>
    </form>
  );
}
