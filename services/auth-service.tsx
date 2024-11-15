import axios, { AxiosResponse } from "axios";

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
      `${process.env.NEXT_PUBLIC_SERVER_URL}login`,
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

export const RegisterUser = async (
  data: LoginData
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const res = await axios.post<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}register`,
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
