import { IAddress } from "@/types";
import axios from "axios";

export const getAddresses = async () => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/addresses`,
      {
        data: {
          reqId: "addresses",
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

export const addAddress = async (address: IAddress) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/address`,
      {
        address,
      }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};
