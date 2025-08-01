import {
  IUser,
  IUserPermission,
  UserRole,
  UserType,
  PermissionType,
} from "@/types";
import apiClient from "@/lib/axios";
import { AxiosResponse } from "axios";

interface UserResponse {
  data: IUser;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

interface UsersResponse {
  data: IUser[];
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

// Update the response interfaces to include pagination
interface PaginatedUsersResponse {
  data: IUser[];
  total: number;
  totalPages: number;
  currentPage: number;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

// Helper functions that now work with auth context
export function getCurrentUserInfo() {
  if (typeof window === "undefined") return null;
  try {
    // Try both localStorage keys for compatibility
    const userInfo =
      localStorage.getItem("userInfo") || localStorage.getItem("accessToken");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    return null;
  }
}

export function getCurrentUserRole(): UserRole | string | null {
  const userInfo = getCurrentUserInfo();
  // Handle both nested and flat role structure
  return userInfo?.role || userInfo?.userInfo?.role || null;
}

export function getCurrentUserId(): string | null {
  const userInfo = getCurrentUserInfo();
  return userInfo?.id || null;
}

export function getCurrentUserBranchId(): string | null {
  const userInfo = getCurrentUserInfo();
  return userInfo?.branchId || userInfo?.userInfo?.branchId || null;
}

export function canAccessUsersSection(): boolean {
  const currentRole = getCurrentUserRole();
  // Handle both string and enum comparisons
  return (
    currentRole === UserRole.superAdmin ||
    currentRole === UserRole.admin ||
    currentRole === "superAdmin" ||
    currentRole === "admin"
  );
}

export function canDeleteUsers(): boolean {
  const currentRole = getCurrentUserRole();
  // Only superAdmin can delete users
  return currentRole === UserRole.superAdmin || currentRole === "superAdmin";
}

export function canEditUsers(): boolean {
  const currentRole = getCurrentUserRole();
  // Both superAdmin and admin can edit users
  return (
    currentRole === UserRole.superAdmin ||
    currentRole === UserRole.admin ||
    currentRole === "superAdmin" ||
    currentRole === "admin"
  );
}

export function canCreateUsers(): boolean {
  const currentRole = getCurrentUserRole();
  // Both superAdmin and admin can create users
  return (
    currentRole === UserRole.superAdmin ||
    currentRole === UserRole.admin ||
    currentRole === "superAdmin" ||
    currentRole === "admin"
  );
}

export function canManageUserPermissions(): boolean {
  const currentRole = getCurrentUserRole();
  // Both superAdmin and admin can manage permissions
  return (
    currentRole === UserRole.superAdmin ||
    currentRole === UserRole.admin ||
    currentRole === "superAdmin" ||
    currentRole === "admin"
  );
}

export function isAuthenticated(): boolean {
  return getCurrentUserInfo() !== null;
}

export function isUserActive(): boolean {
  const userInfo = getCurrentUserInfo();
  return userInfo?.isActive !== false; // Default to true if not specified
}

// Get all users with proper role filtering
export const getUsers = async (): Promise<IUser[] | null> => {
  if (!canAccessUsersSection()) {
    throw new Error("شما دسترسی به این بخش را ندارید");
  }

  try {
    const currentRole = getCurrentUserRole();
    console.log("Current user role:", currentRole); // Debug log

    // Try the basic users endpoint first
    console.log("Fetching users from /admin/users endpoint"); // Debug log
    const res = await apiClient.get<UsersResponse>("/api/admin/users");
    console.log("API Response:", res.data); // Debug log
    console.log("Users count:", res.data.data?.length); // Debug log

    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);

    // If basic endpoint fails, try the roles endpoint as fallback
    try {
      console.log("Trying users-with-roles endpoint as fallback"); // Debug log
      const res = await apiClient.get<UsersResponse>(
        "/api/admin/users-with-roles"
      );
      console.log("Fallback API Response:", res.data); // Debug log
      return res.data.data || [];
    } catch (fallbackError) {
      console.error("Both endpoints failed:", fallbackError);
      return null;
    }
  }
};

export const getUserById = async (
  id: string
): Promise<AxiosResponse<UserResponse>> => {
  if (!canAccessUsersSection()) {
    throw new Error("شما دسترسی به این بخش را ندارید");
  }

  return await apiClient.get<UserResponse>(`/api/admin/users/${id}`);
};

// Create user (with enhanced role restrictions)
export async function createUser(data: any) {
  if (!canCreateUsers()) {
    throw new Error("شما دسترسی به ایجاد کاربر را ندارید");
  }

  const currentRole = getCurrentUserRole();

  // Prevent admin from creating superAdmin users
  if (
    (currentRole === UserRole.admin || currentRole === "admin") &&
    (data.role === UserRole.superAdmin || data.role === "superAdmin")
  ) {
    throw new Error("شما نمی‌توانید کاربر مدیر کل ایجاد کنید");
  }

  try {
    const res = await apiClient.post("/api/admin/users", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw new Error("خطا در ثبت کاربر");
  }
}

// Update user (with enhanced role restrictions)
export async function updateUser(id: string, data: any) {
  if (!canEditUsers()) {
    throw new Error("شما دسترسی به ویرایش کاربر را ندارید");
  }

  const currentRole = getCurrentUserRole();

  // Prevent admin from updating to superAdmin role
  if (
    (currentRole === UserRole.admin || currentRole === "admin") &&
    (data.role === UserRole.superAdmin || data.role === "superAdmin")
  ) {
    throw new Error("شما نمی‌توانید کاربری را به مدیر کل تبدیل کنید");
  }

  try {
    const res = await apiClient.patch(`/api/admin/users/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw new Error("خطا در ویرایش کاربر");
  }
}

// Delete user (only superAdmin can delete)
export async function deleteUser(id: string) {
  if (!canDeleteUsers()) {
    throw new Error("فقط مدیر کل می‌تواند کاربران را حذف کند");
  }

  try {
    const res = await apiClient.delete(`/api/admin/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw new Error("خطا در حذف کاربر");
  }
}

// Toggle user active status (with enhanced role check)
export async function toggleUserStatus(id: string, isActive: boolean) {
  if (!canEditUsers()) {
    throw new Error("شما دسترسی به تغییر وضعیت کاربر را ندارید");
  }

  try {
    const res = await apiClient.patch(
      `/api/admin/users/${id}/status`,
      { isActive },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Toggle user status error:", error);
    throw new Error("خطا در تغییر وضعیت کاربر");
  }
}

// Reset user password (with role check)
export async function resetUserPassword(id: string, newPassword: string) {
  if (!canEditUsers()) {
    throw new Error("شما دسترسی به تغییر رمز عبور را ندارید");
  }

  try {
    const res = await apiClient.patch(
      `/api/admin/users/${id}/password`,
      { password: newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw new Error("خطا در تغییر رمز عبور");
  }
}

// Get user permissions (with role check)
export const getUserPermissions = async (
  userId: string
): Promise<IUserPermission[] | null> => {
  if (!canManageUserPermissions()) {
    throw new Error("شما دسترسی به مدیریت دسترسی‌ها را ندارید");
  }

  try {
    const res = await apiClient.get<{ data: IUserPermission[] }>(
      `/api/admin/users/${userId}/permissions`
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null;
  }
};

// Update user permissions (with role check)
export async function updateUserPermissions(
  userId: string,
  permissions: { permission: PermissionType; branchId?: string }[]
) {
  if (!canManageUserPermissions()) {
    throw new Error("شما دسترسی به مدیریت دسترسی‌ها را ندارید");
  }

  try {
    const res = await apiClient.put(
      `/api/admin/users/${userId}/permissions`,
      { permissions },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Update permissions error:", error);
    throw new Error("خطا در به‌روزرسانی دسترسی‌ها");
  }
}

// Update user role (with enhanced role check)
export async function updateUserRole(userId: string, role: UserRole | string) {
  if (!canEditUsers()) {
    throw new Error("شما دسترسی به تغییر نقش کاربر را ندارید");
  }

  const currentRole = getCurrentUserRole();

  // Prevent admin from setting superAdmin role
  if (
    (currentRole === UserRole.admin || currentRole === "admin") &&
    (role === UserRole.superAdmin || role === "superAdmin")
  ) {
    throw new Error("شما نمی‌توانید کاربری را مدیر کل کنید");
  }

  try {
    const res = await apiClient.patch(
      `/api/admin/users/${userId}/role`,
      { role },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Update role error:", error);
    throw new Error("خطا در به‌روزرسانی نقش کاربر");
  }
}

// Update getStaffUsers with pagination and search
export const getStaffUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<{
  users: IUser[];
  total: number;
  totalPages: number;
  currentPage: number;
} | null> => {
  if (!canAccessUsersSection()) {
    throw new Error("شما دسترسی به این بخش را ندارید");
  }

  try {
    const currentRole = getCurrentUserRole();
    console.log("Fetching staff users for role:", currentRole, {
      page,
      limit,
      search,
    });

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort: "createdAt",
      order: "desc",
    });

    if (search.trim()) {
      params.append("search", search.trim());
    }

    // Sending query parameters to backend
    const endpoint = `/api/admin/users?type=admin&${params.toString()}`;
    const res = await apiClient.get<PaginatedUsersResponse>(endpoint);

    if (res.data && res.data.ok) {
      return {
        users: res.data.data || [],
        total: res.data.total || 0,
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching staff users:", error);
    return null;
  }
};

// Update getCustomerUsers with pagination and search
export const getCustomerUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<{
  users: IUser[];
  total: number;
  totalPages: number;
  currentPage: number;
} | null> => {
  if (!canAccessUsersSection()) {
    throw new Error("شما دسترسی به این بخش را ندارید");
  }

  try {
    console.log("Fetching customer users", { page, limit, search });

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort: "createdAt",
      order: "desc",
    });

    if (search.trim()) {
      params.append("search", search.trim());
    }

    const endpoint = `/api/admin/users?role=customer&${params.toString()}`;
    const res = await apiClient.get<PaginatedUsersResponse>(endpoint);

    if (res.data && res.data.ok) {
      return {
        users: res.data.data || [],
        total: res.data.total || 0,
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
      };
    }

    // Fallback to type=user if role=customer fails
    const fallbackEndpoint = `/api/admin/users?type=user&${params.toString()}`;
    const fallbackRes = await apiClient.get<PaginatedUsersResponse>(
      fallbackEndpoint
    );

    if (fallbackRes.data && fallbackRes.data.ok) {
      return {
        users: fallbackRes.data.data || [],
        total: fallbackRes.data.total || 0,
        totalPages: fallbackRes.data.totalPages || 1,
        currentPage: fallbackRes.data.currentPage || 1,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching customer users:", error);
    return null;
  }
};

// Keep the original getAllUsers for backward compatibility
export const getAllUsers = async (): Promise<IUser[] | null> => {
  if (!canAccessUsersSection()) {
    throw new Error("شما دسترسی به این بخش را ندارید");
  }

  try {
    const res = await apiClient.get<UsersResponse>("/api/admin/users");
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching all users:", error);
    return null;
  }
};
