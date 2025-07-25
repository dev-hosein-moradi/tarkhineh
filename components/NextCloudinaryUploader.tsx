import React, { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Upload, X, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

// TypeScript interfaces matching Cloudinary's actual types
// (Removed local CloudinaryUploadWidgetResults interface to avoid conflict with imported type)

// Cloudinary error type (can be null, string, or various error objects)
type CloudinaryUploadWidgetError =
  | null
  | string
  | { message: string; name?: string; http_code?: number; [key: string]: any }
  | { status: string; statusText: string; [key: string]: any };

interface ImageData {
  id: string;
  publicId: string;
  url: string;
  originalFilename: string;
  format: string;
  width: number;
  height: number;
  size: number;
  createdAt: string;
}

interface NextCloudinaryUploaderProps {
  uploadPreset?: string;
  folder?: string;
  onUploadSuccess?: (result: CloudinaryUploadWidgetResults) => void;
  onUploadError?: (error: CloudinaryUploadWidgetError) => void;
  maxFiles?: number;
  multiple?: boolean;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    [key: string]: any;
  };
}

const NextCloudinaryUploader: React.FC<NextCloudinaryUploaderProps> = ({
  uploadPreset = "yefgbqyx",
  folder = "tarkhineh",
  onUploadSuccess = (result: CloudinaryUploadWidgetResults) =>
    console.log("Upload success:", result),
  onUploadError = (error: CloudinaryUploadWidgetError) =>
    console.log("Upload error:", error),
  maxFiles = 5,
  multiple = true,
  transformation = { width: 800, height: 600, crop: "fill" },
}) => {
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults): void => {
    console.log("Upload success:", result); // Debug log
    if (
      result.event === "success" &&
      result.info &&
      typeof result.info === "object" &&
      "public_id" in result.info
    ) {
      const imageData = {
        id: result.info.public_id,
        publicId: result.info.public_id,
        url: result.info.secure_url,
        originalFilename: result.info.original_filename,
        format: result.info.format,
        width: result.info.width,
        height: result.info.height,
        size: result.info.bytes,
        createdAt: result.info.created_at,
      };

      setUploadedImages((prev) => [...prev, imageData]);
      setIsUploading(false);
      onUploadSuccess(result);
    }
  };

  const handleUploadError = (error: CloudinaryUploadWidgetError): void => {
    console.log("Upload error:", error); // Debug log
    setIsUploading(false);
    onUploadError(error);
  };

  const removeImage = (publicId: string): void => {
    setUploadedImages((prev) =>
      prev.filter((img) => img.publicId !== publicId)
    );
  };

  const clearAll = (): void => {
    setUploadedImages([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const canUploadMore: boolean = uploadedImages.length < maxFiles;

  return (
    <div className="w-full">
      {/* Upload Widget */}
      <div className="mb-4">
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            multiple,
            maxFiles: maxFiles - uploadedImages.length,
            folder,
            resourceType: "image",
            clientAllowedFormats: ["png", "jpg", "jpeg", "gif", "webp"],
            maxFileSize: 10000000, // 10MB
            sources: ["local", "url", "camera"],
            showAdvancedOptions: false, // Simplified for debugging
            cropping: false, // Disabled for debugging
            theme: "default", // Use default theme
            styles: {
              zIndex: 9999,
            },
          }}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          onOpen={() => {
            console.log("Widget opened"); // Debug log
            setIsUploading(true);
          }}
          onClose={() => {
            console.log("Widget closed"); // Debug log
            setIsUploading(false);
          }}
        >
          {({ open }) => (
            <button
              type="button" // Important: prevents form submission
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                e.stopPropagation(); // Stop event bubbling
                if (canUploadMore) {
                  console.log("Opening widget..."); // Debug log
                  open();
                }
              }}
              disabled={!canUploadMore}
              className={`
                w-full border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
                ${
                  canUploadMore
                    ? "border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                }
                ${isUploading ? "border-blue-500 bg-blue-50" : ""}
              `}
            >
              <Upload
                className={`w-8 h-8 mx-auto mb-2 ${
                  canUploadMore ? "text-gray-400" : "text-gray-300"
                }`}
              />

              {isUploading ? (
                <p className="text-sm font-medium text-blue-600">
                  Opening uploader...
                </p>
              ) : (
                <p className="text-sm font-medium text-gray-700">
                  {canUploadMore
                    ? "Click to upload image"
                    : `Maximum ${maxFiles} files reached`}
                </p>
              )}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Show uploaded image preview */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          {uploadedImages.map((image) => (
            <div
              key={image.id}
              className="flex items-center gap-2 p-2 border rounded"
            >
              <img
                src={image.url}
                alt={image.originalFilename}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{image.originalFilename}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(image.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeImage(image.publicId);
                }}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NextCloudinaryUploader;
