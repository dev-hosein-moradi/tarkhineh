import axios, { AxiosResponse } from "axios";

interface DateResponse {
  data: "";
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

export const getDateTime = async (
  request: string
): Promise<AxiosResponse<DateResponse>> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/date`
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
