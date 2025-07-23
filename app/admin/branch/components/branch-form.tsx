"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createBranch, updateBranch } from "@/services/branch-service";
import { toast } from "sonner";

type BranchFormProps = {
  branch?: any;
  onSuccess: () => void;
};

export default function BranchForm({ branch, onSuccess }: BranchFormProps) {
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
    <form className="space-y-4 text-right" dir="rtl" onSubmit={handleSubmit}>
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
      <Input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="آدرس شعبه"
        required
      />
      <Input
        name="ownerFullName"
        value={form.ownerFullName}
        onChange={handleChange}
        placeholder="نام مالک"
      />
      <Input
        name="ownerPhone"
        value={form.ownerPhone}
        onChange={handleChange}
        placeholder="شماره تلفن مالک"
      />
      <Input
        name="workTime"
        value={form.workTime}
        onChange={handleChange}
        placeholder="ساعات کاری"
      />
      <div className="flex gap-2">
        <Input
          name="tel1"
          value={form.tel[0] || ""}
          onChange={(e) =>
            setForm((prev: any) => ({
              ...prev,
              tel: [e.target.value, prev.tel[1] || ""],
            }))
          }
          placeholder="تلفن ۱"
        />
        <Input
          name="tel2"
          value={form.tel[1] || ""}
          onChange={(e) =>
            setForm((prev: any) => ({
              ...prev,
              tel: [prev.tel[0] || "", e.target.value],
            }))
          }
          placeholder="تلفن ۲"
        />
      </div>
      <div className="flex flex-row justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 w-1/4">
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
        <div className="flex items-center gap-2 w-1/4">
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
        <div className="flex items-center gap-2 w-1/4">
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
        <div className="flex items-center gap-2 w-1/4">
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
      <Button className="bg-main" type="submit" disabled={loading}>
        {branch ? "ویرایش شعبه" : "ثبت شعبه"}
      </Button>
    </form>
  );
}
