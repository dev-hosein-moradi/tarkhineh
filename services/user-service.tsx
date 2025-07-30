import {
  IUser,
  IUserPermission,
  UserRole,
  UserType,
  PermissionType,
} from "@/types";
import axios, { AxiosResponse } from "axios";

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

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Helper to get token from cookie
function getAccessToken() {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? match[1] : null;
}

// Get all users (admin only) - Updated to use users-with-roles endpoint
export const getUsers = async (): Promise<IUser[] | null> => {
  const token = getAccessToken();
  try {
    const res = await axios.get<UsersResponse>(
      `${BASE_URL}api/admin/users-with-roles`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (
  id: string
): Promise<AxiosResponse<UserResponse>> => {
  const token = getAccessToken();
  try {
    const res = await axios.get<UserResponse>(
      `${BASE_URL}api/admin/users/${id}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Create user
export async function createUser(data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.post(`${BASE_URL}api/admin/users`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw new Error("خطا در ثبت کاربر");
  }
}

// Update user
export async function updateUser(id: string, data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.patch(`${BASE_URL}api/admin/users/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw new Error("خطا در ویرایش کاربر");
  }
}

// Delete user
export async function deleteUser(id: string) {
  const token = getAccessToken();
  try {
    const res = await axios.delete(`${BASE_URL}api/admin/users/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw new Error("خطا در حذف کاربر");
  }
}

// Toggle user active status
export async function toggleUserStatus(id: string, isActive: boolean) {
  const token = getAccessToken();
  try {
    const res = await axios.patch(
      `${BASE_URL}api/admin/users/${id}/status`,
      { isActive },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Toggle user status error:", error);
    throw new Error("خطا در تغییر وضعیت کاربر");
  }
}

// Reset user password
export async function resetUserPassword(id: string, newPassword: string) {
  const token = getAccessToken();
  try {
    const res = await axios.patch(
      `${BASE_URL}api/admin/users/${id}/password`,
      { password: newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw new Error("خطا در تغییر رمز عبور");
  }
}

// Get user permissions - Fixed to match your backend endpoint
export const getUserPermissions = async (
  userId: string
): Promise<IUserPermission[] | null> => {
  const token = getAccessToken();
  try {
    const res = await axios.get<{ data: IUserPermission[] }>(
      `${BASE_URL}api/admin/users/${userId}/permissions`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null;
  }
};

// Add permissions to user (keeps existing ones) - Uses POST
export async function assignUserPermissions(
  userId: string,
  permissions: { permission: PermissionType; branchId?: string }[]
) {
  const token = getAccessToken();
  try {
    const res = await axios.post(
      `${BASE_URL}api/admin/users/${userId}/permissions`,
      { permissions },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Assign permissions error:", error);
    throw new Error("خطا در تخصیص دسترسی‌ها");
  }
}

// Update user permissions (replace all permissions) - Uses PUT for full replacement
export async function updateUserPermissions(
  userId: string,
  permissions: { permission: PermissionType; branchId?: string }[]
) {
  const token = getAccessToken();
  try {
    const res = await axios.put(
      `${BASE_URL}api/admin/users/${userId}/permissions`,
      { permissions },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Update permissions error:", error);
    throw new Error("خطا در به‌روزرسانی دسترسی‌ها");
  }
}

// Remove user permissions - Uses DELETE
export async function removeUserPermissions(
  userId: string,
  permissions: { permission: PermissionType; branchId?: string }[]
) {
  const token = getAccessToken();
  try {
    const res = await axios.delete(
      `${BASE_URL}api/admin/users/${userId}/permissions`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        data: { permissions }, // DELETE requests with body need to use 'data' property
      }
    );
    return res.data;
  } catch (error) {
    console.error("Remove permissions error:", error);
    throw new Error("خطا در حذف دسترسی‌ها");
  }
}

// Update user role - Uses PATCH
export async function updateUserRole(userId: string, role: UserRole) {
  const token = getAccessToken();
  try {
    const res = await axios.patch(
      `${BASE_URL}api/admin/users/${userId}/role`,
      { role },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Update role error:", error);
    throw new Error("خطا در به‌روزرسانی نقش کاربر");
  }
}
