import axios from "axios";

export async function getCategories() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/categories`,
      {
        data: {
          reqId: "categories",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
}
