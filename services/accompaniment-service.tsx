import { IAccompaniment, IAccompanimentCategory } from "@/types";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

interface AccompanimentResponse {
  data: IAccompaniment;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

interface AccompanimentsResponse {
  data: IAccompaniment[];
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

interface AccompanimentCategoryResponse {
  data: IAccompanimentCategory;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

interface AccompanimentCategoriesResponse {
  data: IAccompanimentCategory[];
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

// ============ ACCOMPANIMENT CATEGORIES ============

// Get all accompaniment categories (public)
export const getAccompanimentCategories = async (): Promise<
  IAccompanimentCategory[] | null
> => {
  try {
    const res = await axios.get(`${BASE_URL}api/accompaniment-categories`, {
      data: { reqId: "accompaniment-categories" },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching accompaniment categories:", error);
    return null;
  }
};

// Get all accompaniment categories for admin (with authentication)
export const getAdminAccompanimentCategories = async (): Promise<
  IAccompanimentCategory[] | null
> => {
  const token = getAccessToken();
  try {
    const res = await axios.get<AccompanimentCategoriesResponse>(
      `${BASE_URL}api/admin/accompaniment-categories`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching admin accompaniment categories:", error);
    return null;
  }
};

// Get accompaniment category by ID
export const getAccompanimentCategoryById = async (
  id: string
): Promise<AxiosResponse<AccompanimentCategoryResponse>> => {
  try {
    const res = await axios.get<AccompanimentCategoryResponse>(
      `${BASE_URL}api/accompaniment-categories/${id}`
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Admin accompaniment category services
export async function createAccompanimentCategory(data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.post(
      `${BASE_URL}api/admin/accompaniment-categories`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Create accompaniment category error:", error);
    throw new Error("خطا در ثبت دسته‌بندی");
  }
}

export async function updateAccompanimentCategory(id: string, data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.patch(
      `${BASE_URL}api/admin/accompaniment-categories/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Update accompaniment category error:", error);
    throw new Error("خطا در ویرایش دسته‌بندی");
  }
}

export async function deleteAccompanimentCategory(id: string) {
  const token = getAccessToken();
  try {
    const res = await axios.delete(
      `${BASE_URL}api/admin/accompaniment-categories/${id}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Delete accompaniment category error:", error);
    throw new Error("خطا در حذف دسته‌بندی");
  }
}

// ============ ACCOMPANIMENTS ============

// Get all accompaniments (public)
export const getAccompaniments = async (): Promise<IAccompaniment[] | null> => {
  try {
    const res = await axios.get(`${BASE_URL}api/accompaniments`, {
      data: { reqId: "accompaniments" },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching accompaniments:", error);
    return null;
  }
};

// Get all accompaniments for admin (with authentication)
export const getAdminAccompaniments = async (): Promise<
  IAccompaniment[] | null
> => {
  const token = getAccessToken();
  try {
    const res = await axios.get<AccompanimentsResponse>(
      `${BASE_URL}api/admin/accompaniments`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching admin accompaniments:", error);
    return null;
  }
};

// Get accompaniment by ID
export const getAccompanimentById = async (
  id: string
): Promise<AxiosResponse<AccompanimentResponse>> => {
  try {
    const res = await axios.get<AccompanimentResponse>(
      `${BASE_URL}api/accompaniments/${id}`
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Admin accompaniment services
export async function createAccompaniment(data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.post(`${BASE_URL}api/admin/accompaniments`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Create accompaniment error:", error);
    throw new Error("خطا در ثبت اقلام");
  }
}

export async function updateAccompaniment(id: string, data: any) {
  const token = getAccessToken();
  try {
    const res = await axios.patch(
      `${BASE_URL}api/admin/accompaniments/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Update accompaniment error:", error);
    throw new Error("خطا در ویرایش اقلام");
  }
}

export async function deleteAccompaniment(id: string) {
  const token = getAccessToken();
  try {
    const res = await axios.delete(
      `${BASE_URL}api/admin/accompaniments/${id}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Delete accompaniment error:", error);
    throw new Error("خطا در حذف اقلام");
  }
}
