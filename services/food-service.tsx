import { IFood } from "@/types";
import axios, { AxiosResponse } from "axios";

interface FoodResponse {
  data: IFood;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

export const getFoods = async () => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/foods`,
      {
        data: {
          reqId: "foods",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const getFoodById = async (
  id: string
): Promise<AxiosResponse<FoodResponse>> => {
  try {
    const res = await axios.get<FoodResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/food/${id}`
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