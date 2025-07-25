import { IBranch } from "@/types";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

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

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Helper to get token from cookie
function getAccessToken() {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? match[1] : null;
}

// Get all branches (public)
export const getBranchs = async (): Promise<IBranch[] | null> => {
  try {
    const res = await axios.get(`${BASE_URL}api/branches`, {
      data: { reqId: "branches" },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return null;
  }
};

// Get all branches for admin (with authentication)
export const getAdminBranches = async (): Promise<IBranch[] | null> => {
  const token = getAccessToken();
  try {
    const res = await axios.get<BranchesResponse>(
      `${BASE_URL}api/admin/branches`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching admin branches:", error);
    return null;
  }
};

// Get branch by ID
export const getBranchById = async (
  id: string
): Promise<AxiosResponse<BranchResponse>> => {
  try {
    const res = await axios.get<BranchResponse>(
      `${BASE_URL}api/branches/${id}`
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Admin branch services
export async function createBranch(data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.post(`${BASE_URL}api/admin/branches`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create branch error:", error);
    throw new Error("خطا در ثبت شعبه");
  }
}

export async function updateBranch(id: string, data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.patch(`${BASE_URL}api/admin/branches/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update branch error:", error);
    throw new Error("خطا در ویرایش شعبه");
  }
}

export async function deleteBranch(id: string) {
  const token = getAccessToken();
  try {
    const res = await axios.delete(`${BASE_URL}api/admin/branches/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Delete branch error:", error);
    throw new Error("خطا در حذف شعبه");
  }
}
