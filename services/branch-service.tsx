import { IBranch } from "@/types";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie"; // <-- use js-cookie for client-side cookie access

interface BranchResponse {
  data: IBranch;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Get all branches
export const getBranchs = async () => {
  try {
    const res = await axios.get(`${BASE_URL}api/branches`, {
      data: { reqId: "branches" },
    });
    return res.data.data;
  } catch (error) {
    return null;
  }
};

// Get branch by ID
export const getBranchById = async (
  id: string
): Promise<AxiosResponse<BranchResponse>> => {
  try {
    const res = await axios.get<BranchResponse>(`${BASE_URL}api/branch/${id}`);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Helper to get token from cookie
function getAccessToken() {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? match[1] : null;
}

// Admin branch services with axios
export async function createBranch(data: any) {
  const token = getAccessToken();
  console.log(token);

  try {
    const res = await axios.post(`${BASE_URL}api/admin/branches`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("خطا در ثبت شعبه");
  }
}

export async function updateBranch(id: string, data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.put(`${BASE_URL}api/branches/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("خطا در ویرایش شعبه");
  }
}

export async function deleteBranch(id: string) {
  const token = getAccessToken();
  try {
    const res = await axios.delete(`${BASE_URL}api/branches/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("خطا در حذف شعبه");
  }
}
