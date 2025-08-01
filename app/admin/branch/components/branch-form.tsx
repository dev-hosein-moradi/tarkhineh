"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Camera, RefreshCw } from "lucide-react";
import { IBranch } from "@/types";
import { createBranch, updateBranch } from "@/services/branch-service";
import { toast } from "sonner";

interface BranchFormProps {
  branch?: IBranch | null;
  onSuccess: () => void;
  isEditing?: boolean;
}

export default function BranchForm({
  branch,
  onSuccess,
  isEditing = false,
}: BranchFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    address: "",
    ownerFullName: "",
    ownerPhone: "",
    tel: [""],
    kitchen: false,
    parking: false,
    store: false,
    image: "", // Single image instead of array
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load branch data when editing
  useEffect(() => {
    if (branch) {
      console.log("Loading branch data:", branch);

      setFormData({
        name: branch.name || "",
        title: branch.title || "",
        address: branch.address || "",
        ownerFullName: branch.ownerFullName || "",
        ownerPhone: branch.ownerPhone || "",
        tel: branch.tel && branch.tel.length > 0 ? branch.tel : [""],
        kitchen: branch.kitchen || false,
        parking: branch.parking || false,
        store: branch.store || false,
        // Better image extraction logic
        image: branch.images?.[0] || branch.mainImage || "",
      });

      console.log("Branch image data:", {
        images: branch.images,
        mainImage: branch.mainImage,
        selectedImage: branch.images?.[0] || branch.mainImage || "",
      });
    }
  }, [branch]); // Only depend on branch, not isEditing

  const handleImageUpload = async () => {
    try {
      setUploadingImage(true);

      // Check if Cloudinary script is loaded
      if (typeof window === "undefined" || !(window as any).cloudinary) {
        // Try to load Cloudinary script dynamically
        await loadCloudinaryScript();
      }

      if (!(window as any).cloudinary) {
        toast.error("ابزار آپلود در دسترس نیست");
        setUploadingImage(false);
        return;
      }

      console.log("Opening Cloudinary widget...");

      // Configure Cloudinary upload widget
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 5000000, // 5MB
          transformation: [
            { width: 800, height: 600, crop: "fill", quality: "auto" },
          ],
          sources: ["local", "url", "camera"], // Enable camera option
        },
        (error: any, result: any) => {
          console.log("Cloudinary callback:", { error, result });

          if (error) {
            console.error("Upload error:", error);
            toast.error(
              `خطا در آپلود تصویر: ${error.message || "Unknown error"}`
            );
            setUploadingImage(false);
            return;
          }

          if (result.event === "success") {
            const newImageUrl = result.info.secure_url;
            console.log("Image uploaded successfully:", newImageUrl);

            // Replace the existing image
            setFormData((prev) => ({
              ...prev,
              image: newImageUrl,
            }));

            toast.success("تصویر با موفقیت آپلود شد");
          }

          if (result.event === "close") {
            setUploadingImage(false);
          }
        }
      );

      widget.open();
    } catch (error) {
      console.error("Widget error:", error);
      toast.error("خطا در باز کردن ابزار آپلود");
      setUploadingImage(false);
    }
  };

  // Add this helper function to load Cloudinary script dynamically
  const loadCloudinaryScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).cloudinary) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => {
        console.log("Cloudinary script loaded");
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load Cloudinary script");
        reject(new Error("Failed to load Cloudinary script"));
      };
      document.head.appendChild(script);
    });
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
    toast.success("تصویر حذف شد");
  };

  const handleTelChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newTel = [...prev.tel];
      newTel[index] = value;
      return { ...prev, tel: newTel };
    });
  };

  const addTelField = () => {
    setFormData((prev) => ({
      ...prev,
      tel: [...prev.tel, ""],
    }));
  };

  const removeTelField = (index: number) => {
    if (formData.tel.length > 1) {
      setFormData((prev) => ({
        ...prev,
        tel: prev.tel.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error("نام شعبه و آدرس الزامی است");
      return;
    }

    setLoading(true);

    try {
      // Clean and prepare the data
      const submitData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        address: formData.address.trim(),
        ownerFullName: formData.ownerFullName.trim(),
        ownerPhone: formData.ownerPhone.trim(),
        tel: formData.tel.filter((t) => t.trim() !== ""),
        kitchen: Boolean(formData.kitchen),
        parking: Boolean(formData.parking),
        store: Boolean(formData.store),
        // Only include image fields if there's an image
        ...(formData.image && {
          images: [formData.image],
          mainImage: formData.image,
        }),
      };

      console.log("Form submission data:", {
        isEditing,
        branchId: branch?.id,
        submitData,
        originalFormData: formData,
      });

      if (isEditing && branch?.id) {
        await updateBranch(branch.id, submitData);
        toast.success("شعبه با موفقیت ویرایش شد");
      } else {
        await createBranch(submitData);
        toast.success("شعبه با موفقیت ایجاد شد");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "خطا در ذخیره اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پایه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">نام شعبه *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="نام شعبه"
                required
              />
            </div>
            <div>
              <Label htmlFor="title">عنوان شعبه</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="عنوان شعبه"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">آدرس *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="آدرس کامل شعبه"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownerFullName">نام مالک</Label>
              <Input
                id="ownerFullName"
                value={formData.ownerFullName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ownerFullName: e.target.value,
                  }))
                }
                placeholder="نام کامل مالک"
              />
            </div>
            <div>
              <Label htmlFor="ownerPhone">تلفن مالک</Label>
              <Input
                id="ownerPhone"
                value={formData.ownerPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ownerPhone: e.target.value,
                  }))
                }
                placeholder="09123456789"
              />
            </div>
          </div>

          {/* Phone Numbers */}
          <div>
            <Label>تلفن‌های شعبه</Label>
            <div className="space-y-2">
              {formData.tel.map((tel, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tel}
                    onChange={(e) => handleTelChange(index, e.target.value)}
                    placeholder="021-12345678"
                    className="flex-1"
                  />
                  {formData.tel.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTelField(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTelField}
                className="mt-2"
              >
                + افزودن تلفن
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Section - Single Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            تصویر شعبه
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Image Display */}
          {formData.image ? (
            <div>
              <Label>تصویر فعلی</Label>
              <div className="relative inline-block mt-2 w-full max-w-md">
                <img
                  src={formData.image}
                  alt="تصویر شعبه"
                  className="w-full h-48 object-cover rounded-lg border shadow-sm"
                  onError={(e) => {
                    console.error("Image failed to load:", formData.image);
                    e.currentTarget.src = "/placeholder-image.jpg"; // Add a placeholder
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully:", formData.image);
                  }}
                />

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute top-2 left-2"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Replace Button */}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  className="absolute bottom-2 right-2"
                >
                  {uploadingImage ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "تغییر تصویر"
                  )}
                </Button>
              </div>

              {/* Debug Info */}
              <div className="text-xs text-gray-500 mt-2">
                URL: {formData.image.substring(0, 50)}...
              </div>
            </div>
          ) : (
            /* Upload Button when no image */
            <div>
              <Label>تصویر شعبه</Label>
              <Button
                type="button"
                variant="outline"
                onClick={handleImageUpload}
                disabled={uploadingImage}
                className="w-full h-32 border-dashed border-2 flex flex-col gap-2 mt-2"
              >
                {uploadingImage ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>در حال آپلود...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8" />
                    <span>افزودن تصویر شعبه</span>
                    <span className="text-xs text-gray-500">
                      فرمت JPG/PNG، حداکثر 5MB
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>امکانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="kitchen">آشپزخانه</Label>
              <Switch
                dir="ltr"
                id="kitchen"
                checked={formData.kitchen}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, kitchen: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="parking">پارکینگ</Label>
              <Switch
                dir="ltr"
                id="parking"
                checked={formData.parking}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, parking: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="store">انبار</Label>
              <Switch
                dir="ltr"
                id="store"
                checked={formData.store}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, store: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading
            ? "در حال ذخیره..."
            : isEditing
            ? "ویرایش شعبه"
            : "ایجاد شعبه"}
        </Button>
      </div>
    </form>
  );
}
