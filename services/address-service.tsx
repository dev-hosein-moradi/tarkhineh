import axios, { AxiosResponse } from "axios";
import { IAddress } from "@/types";

interface AddressResponse {
  data: boolean;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

export const getAddresses = async (id: string) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/addresses`,
      {
        params: {
          userId: id,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const getAddress = async (id: string) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/address/${id}`,
      {
        data: {
          reqId: "address",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const addAddress = async (
  address: IAddress,
  token: string
): Promise<AxiosResponse<AddressResponse>> => {
  try {
    const res = await axios.post<AddressResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/address`,
      { ...address },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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

export const EditAddress = async (
  address: IAddress,
  token: string
): Promise<AxiosResponse<AddressResponse>> => {
  try {
    const res = await axios.patch<AddressResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/address`,
      { ...address },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
