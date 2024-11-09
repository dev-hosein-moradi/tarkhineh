import axios, { AxiosResponse } from "axios";
import { IOrder } from "@/types";

interface OrderResponse {
  data: boolean;
  status: number;
  error: Record<string, null>;
  ok: boolean;
  message: string;
}

export const getOrdersByUser = async (
  userId: string
): Promise<AxiosResponse<OrderResponse>> => {
  try {
    const res = await axios.get<OrderResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/orders`
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

export const getOrders = async (id: string) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/orders`,
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

export const getOrder = async (id: string) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/order/${id}`,
      {
        data: {
          reqId: "order",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const addOrder = async (
  order: IOrder,
  token: string
): Promise<AxiosResponse<OrderResponse>> => {
  try {
    const res = await axios.post<OrderResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/order`,
      { ...order },
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

export const EditOrder = async (
  order: IOrder,
  token: string
): Promise<AxiosResponse<OrderResponse>> => {
  try {
    const res = await axios.patch<OrderResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/order`,
      { ...order },
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

export const DeleteOrder = async (
  id: string,
  token: string
): Promise<AxiosResponse<OrderResponse>> => {
  try {
    const res = await axios.delete<OrderResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/order/${id}`,
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
