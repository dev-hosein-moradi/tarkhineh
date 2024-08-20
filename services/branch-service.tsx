import axios from "axios";

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
