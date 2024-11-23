import { IBranch } from "@/types";
import axios, { AxiosResponse } from "axios";

interface BranchResponse {
  data: IBranch;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

export const getBranchs = async () => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/branchs`,
      {
        data: {
          reqId: "branchs",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const getBranchById = async (
  id: string
): Promise<AxiosResponse<BranchResponse>> => {
  try {
    const res = await axios.get<BranchResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/branch/${id}`
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
