import { IBranch } from "@/types";
import apiClient from "@/lib/axios";

interface BranchResponse {
  data: IBranch;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

interface BranchesResponse {
  data: IBranch[];
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

interface PaginatedBranchesResponse {
  data: IBranch[];
  total: number;
  totalPages: number;
  currentPage: number;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

// Helper functions for branch permissions
export function getCurrentUserRole(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.role;
    }
    return null;
  } catch {
    return null;
  }
}

export function canAccessBranchesSection(): boolean {
  const currentRole = getCurrentUserRole();
  return (
    currentRole === "superAdmin" ||
    currentRole === "admin" ||
    currentRole === "branchManager"
  );
}

export function canCreateBranches(): boolean {
  const currentRole = getCurrentUserRole();
  // Only superAdmin can create branches
  return currentRole === "superAdmin";
}

export function canEditBranches(): boolean {
  const currentRole = getCurrentUserRole();
  // SuperAdmin and Admin can edit branches
  return currentRole === "superAdmin" || currentRole === "admin";
}

export function canDeleteBranches(): boolean {
  const currentRole = getCurrentUserRole();
  // Only superAdmin can delete branches
  return currentRole === "superAdmin";
}

export function canViewBranches(): boolean {
  const currentRole = getCurrentUserRole();
  // All roles can view branches
  return (
    currentRole === "superAdmin" ||
    currentRole === "admin" ||
    currentRole === "branchManager" ||
    currentRole === "staff"
  );
}

// Get branches with pagination and search
export const getBranches = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<{
  branches: IBranch[];
  total: number;
  totalPages: number;
  currentPage: number;
} | null> => {
  if (!canAccessBranchesSection()) {
    throw new Error("شما دسترسی به این بخش را ندارید");
  }

  try {
    console.log("Fetching branches", { page, limit, search });

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort: "createdAt",
      order: "desc",
    });

    if (search.trim()) {
      params.append("search", search.trim());
    }

    const endpoint = `/api/admin/branches?${params.toString()}`;
    const res = await apiClient.get<PaginatedBranchesResponse>(endpoint);

    if (res.data && res.data.ok) {
      return {
        branches: res.data.data || [],
        total: res.data.total || 0,
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return null;
  }
};

// Keep original function for backward compatibility
export const getBranchs = async (): Promise<IBranch[] | null> => {
  if (!canAccessBranchesSection()) {
    throw new Error("شما دسترسی به این بخش را ندارید");
  }

  try {
    const res = await apiClient.get<BranchesResponse>("/api/admin/branches");
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching branches:", error);
    return null;
  }
};

// Get branch by ID
export const getBranchById = async (id: string): Promise<IBranch | null> => {
  if (!canViewBranches()) {
    throw new Error("شما دسترسی به مشاهده شعبه را ندارید");
  }

  try {
    const res = await apiClient.get<BranchResponse>(
      `/api/admin/branches/${id}`
    );
    return res.data.data || null;
  } catch (error) {
    console.error("Error fetching branch:", error);
    return null;
  }
};

// Create branch (only superAdmin)
export async function createBranch(data: any) {
  if (!canCreateBranches()) {
    throw new Error("فقط مدیر کل می‌تواند شعبه جدید ایجاد کند");
  }

  try {
    const res = await apiClient.post("/api/admin/branches", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create branch error:", error);
    throw new Error("خطا در ایجاد شعبه");
  }
}

// Update branch (superAdmin and admin)
export async function updateBranch(id: string, data: any) {
  if (!canEditBranches()) {
    throw new Error("شما دسترسی به ویرایش شعبه را ندارید");
  }

  try {
    console.log("Updating branch with data:", {
      id,
      data,
      dataKeys: Object.keys(data),
      imageData: {
        hasImage: !!data.image,
        hasImages: !!data.images,
        hasMainImage: !!data.mainImage,
        imageValue: data.image,
        imagesValue: data.images,
        mainImageValue: data.mainImage,
      },
    });

    const res = await apiClient.patch(`/api/admin/branches/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Update branch success:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Update branch error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      fullError: error,
    });

    // Return more specific error message
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      "خطا در ویرایش شعبه";

    throw new Error(errorMessage);
  }
}

// Delete branch (only superAdmin)
export async function deleteBranch(id: string) {
  if (!canDeleteBranches()) {
    throw new Error("فقط مدیر کل می‌تواند شعبه را حذف کند");
  }

  try {
    const res = await apiClient.delete(`/api/admin/branches/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete branch error:", error);
    throw new Error("خطا در حذف شعبه");
  }
}

// Toggle branch verification status
export async function toggleBranchVerification(
  id: string,
  verification: boolean
) {
  if (!canEditBranches()) {
    throw new Error("شما دسترسی به تغییر وضعیت تایید شعبه را ندارید");
  }

  try {
    const res = await apiClient.patch(
      `/api/admin/branches/${id}/verification`,
      { verification },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Toggle verification error:", error);
    throw new Error("خطا در تغییر وضعیت تایید شعبه");
  }
}
