import axios from "axios";

export const getCarts = async () => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 8000));
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/carts`,
      {
        data: {
          reqId: "carts",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};
