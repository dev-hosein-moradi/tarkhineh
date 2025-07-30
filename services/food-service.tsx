import { IFood } from "@/types";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

interface FoodResponse {
  data: IFood;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

interface FoodsResponse {
  data: IFood[];
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

// Get all foods (public)
export const getFoods = async (): Promise<IFood[] | null> => {
  try {
    const res = await axios.get(`${BASE_URL}api/foods`, {
      data: { reqId: "foods" },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching foods:", error);
    return null;
  }
};

// Get all foods for admin (with authentication)
export const getAdminFoods = async (): Promise<IFood[] | null> => {
  const token = getAccessToken();
  try {
    const res = await axios.get<FoodsResponse>(`${BASE_URL}api/admin/foods`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching admin foods:", error);
    return null;
  }
};

// Get food by ID
export const getFoodById = async (
  id: string
): Promise<AxiosResponse<FoodResponse>> => {
  try {
    const res = await axios.get<FoodResponse>(`${BASE_URL}api/foods/${id}`);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Admin food services
export async function createFood(data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.post(`${BASE_URL}api/admin/foods`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create food error:", error);
    throw new Error("خطا در ثبت غذا");
  }
}

export async function updateFood(id: string, data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.patch(`${BASE_URL}api/admin/foods/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update food error:", error);
    throw new Error("خطا در ویرایش غذا");
  }
}

export async function deleteFood(id: string) {
  const token = getAccessToken();
  try {
    const res = await axios.delete(`${BASE_URL}api/admin/foods/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Delete food error:", error);
    throw new Error("خطا در حذف غذا");
  }
}
