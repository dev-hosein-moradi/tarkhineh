import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

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

export const LoginUser = async (
  data: LoginData
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await axios.post<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/login`,
      data,
      { withCredentials: true }
    );

    console.log(res.headers);
    // Cookies.set("authToken", res.headers["authToken"]);

    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Rethrow the original error so we can access status and response details later
      throw error;
    }
    // Throw a generic error for unexpected cases
    throw new Error("An unexpected error occurred");
  }
};

export const RegisterUser = async (
  data: LoginData
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await axios.post<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/register`,
      data
    );

    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Rethrow the original error so we can access status and response details later
      throw error;
    }
    // Throw a generic error for unexpected cases
    throw new Error("An unexpected error occurred");
  }
};

export const handleLogout = async (): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}logout`,
      { withCredentials: true }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Rethrow the original error so we can access status and response details later
      throw error;
    }
    // Throw a generic error for unexpected cases
    throw new Error("An unexpected error occurred");
  }
};
