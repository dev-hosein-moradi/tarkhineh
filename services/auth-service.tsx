import axios, { AxiosResponse } from "axios";
import apiClient from "@/lib/axios"; // Use your configured axios instance

interface AuthResponse {
  data: any;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

interface LoginData {
  mobile: string;
  password: string;
}

// Use apiClient instead of raw axios for all auth operations
export const LoginUser = async (
  data: LoginData
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await apiClient.post<AuthResponse>(
      "/api/login", // Changed from /auth/login to /api/login
      data
    );

    console.log("Login response headers:", res.headers);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred during login");
  }
};

export const RegisterUser = async (
  data: LoginData
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await apiClient.post<AuthResponse>(
      "/api/register", // Changed from /auth/register to /api/register
      data
    );

    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred during registration");
  }
};

export const handleLogout = async (): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await apiClient.post<AuthResponse>(
      "/api/logout", // This was already correct
      {}
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred during logout");
  }
};

export const refreshToken = async (): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await apiClient.post<AuthResponse>("/api/refresh-token"); // Changed from /auth/refresh to /api/refresh-token
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred during token refresh");
  }
};

// Verify token validity
export const verifyToken = async (): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await apiClient.get<AuthResponse>("/api/verify"); // This was already correct
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred during token verification");
  }
};
