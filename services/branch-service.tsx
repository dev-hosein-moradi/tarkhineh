import axios from "axios";

export const getBranchs = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/branchs`,
      {
        data: {
          reqId: "branchs",
        },
      }
    );
    return res.data;
  } catch (error) {
    return [];
  }
};
