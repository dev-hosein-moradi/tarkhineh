import axios from "axios";

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
