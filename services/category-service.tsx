import axios from "axios";

export const getCategories = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/categories`,
      {
        data: {
          reqId: "categories",
        },
      }
    );
    return res.data;
  } catch (error) {
    return [];
  }
};
