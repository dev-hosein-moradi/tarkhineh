import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserOrder } from "@/hooks/use-order";
import { getBranchById } from "@/services/branch-service";
import { getFoodById } from "@/services/food-service";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import {
  BadgeDollarSign,
  CalendarClock,
  CarFront,
  CheckCircle,
  Clock,
  Home,
} from "lucide-react";

dayjs.extend(utc);
dayjs.extend(jalaliday);

interface FoodCardState {
  data: UserOrder;
}

interface OrderBranch {
  id: string;
  name: string;
  address: string;
}

interface OrderFood {
  id: string;
  quantity: number;
  url: string;
  price: string;
}

const statusDict: any = {
  1: "جاری",
  2: "جاری",
  3: "تحویل شده",
  4: "لغو شده",
  5: "لغو شده",
};

const statusColorDict: any = {
  1: "warning",
  2: "warning",
  3: "main",
  4: "error",
  5: "error",
};

const statusBgColorDict: any = {
  1: "warning-extra-light",
  2: "warning-extra-light",
  3: "tint-1",
  4: "error-extra-light",
  5: "error-extra-light",
};

const FoodCard: React.FC<FoodCardState> = ({ data }) => {
  const [branch, setBranch] = useState<OrderBranch>({
    id: "",
    name: "",
    address: "",
  });
  const [foods, setFoods] = useState<OrderFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(data);

  // Get branch name and address by ID
  useEffect(() => {
    const getBranch = async () => {
      try {
        if (data.branchId && data.branchId.length > 0) {
          const res = await getBranchById(data.branchId);
          const branch = res.data.data;
          console.log(res.data);

          setBranch({
            id: branch?.id,
            name: branch.name,
            address: branch.address,
          });
        } else {
          console.log("missing branch ID");
        }
      } catch (error) {
        console.error("Error fetching branch:", error);
        setError("Failed to fetch branch data");
      }
    };
    getBranch();
  }, [data?.branchId]);

  // Get food image, price, and quantity by ID (for multiple foods)
  const getFoods = async (foods: { id: string; quantity: number }[]) => {
    setLoading(true);
    setError(null);

    try {
      // Use Promise.all to fetch food data for all food IDs
      const foodPromises = foods.map((food) =>
        getFoodById(food.id).then((res) => {
          const foodData = res.data.data;

          // Map the response to the OrderFood format
          return {
            id: foodData.id,
            quantity: food.quantity,
            url: foodData.image,
            price: foodData.discountPrice || foodData.mainPrice,
          } as OrderFood;
        })
      );

      // Wait for all promises to resolve
      const results = await Promise.all(foodPromises);

      // Set food state with the results
      setFoods(results);
    } catch (error) {
      console.error("Error fetching food data:", error);
      setError("Failed to fetch food data");
    } finally {
      setLoading(false);
    }
  };

  // Call getFoods with the list of food IDs (assuming data.foodIds exists)
  useEffect(() => {
    if (data?.foods && data.foods.length > 0) {
      getFoods(data.foods); // Assuming `data.foodIds` is an array of food IDs
    }
  }, [data?.foods]);

  const formattedDate = dayjs
    .utc(data.time)
    .calendar("jalali")
    .locale("fa")
    .format("dddd D MMMM، ساعت HH:mm");

  if (!data) return <>no data!</>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="border rounded shadow p-4 w-full flex flex-col gap-3">
      <div className="w-full flex flex-row-reverse items-center justify-between">
        <h3 className="text-lg font-medium">{branch.name}</h3>
        <div className="flex flex-row-reverse items-center gap-2">
          {/* delivery type */}
          <span className="text-xs bg-gray-100 p-2 rounded-md">
            {data.userAddress.length > 0 ? "ارسال توسط پیک" : "تحویل حضوری"}
          </span>
          {/* status */}
          <span
            className={`text-${statusColorDict[Number(data.status)]} bg-${
              statusBgColorDict[Number(data.status)]
            } text-xs p-2 rounded-md`}
          >
            {statusDict[Number(data.status)]}
          </span>
        </div>
      </div>
      <div className="flex flex-row-reverse items-center justify-center sm:justify-between flex-wrap gap-2">
        <div className="w-full sm:w-max text-center flex flex-row-reverse items-center justify-start sm:justify-normal gap-2 text-sm text-gray-800">
          <CalendarClock className="w-5 h-5 text-gray-500" />
          {formattedDate}
        </div>
        <div className="w-full sm:w-max flex flex-row-reverse items-center justify-start sm:justify-normal text-sm text-gray-800 gap-2">
          <BadgeDollarSign className="w-5 h-5 text-gray-500" />
          <p>مبلغ: {Number(data.price).toLocaleString("fa-IR")}</p>
          <p>تخفیف: {Number(data.price).toLocaleString("fa-IR")}</p>
        </div>
        <div className="w-full sm:w-max flex flex-row-reverse items-center justify-start sm:justify-normal text-sm text-gray-800 gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          تحویل تا
          {"24:12"
            .split(":")
            .map(Number)
            .map((n) => n.toLocaleString("fa-IR"))
            .join(":")}
        </div>
      </div>

      <div className="w-full flex flex-row-reverse item-center justify-center flex-nowrap my-4">
        <div className="flex-1 flex flex-row items-center gap-1">
          <hr className="border-dashed border-gray-300 w-full" />
          <div className="flex flex-row-reverse items-center">
            <Home className={`w-6 h-6 text-gray-400`} />
            <p className="text-xs hidden lg:flex w-max">در حال آماده سازی</p>
          </div>
        </div>
        <div className="flex-1 flex flex-row items-center gap-1">
          <hr className="border-dashed border-gray-300 w-full" />
          <div className="flex flex-row-reverse items-center">
            <CarFront className={`w-6 h-6 text-gray-400`} />
            <p className="text-xs hidden lg:flex w-max">ارسال توسط پیک</p>
          </div>
          <hr className="border-dashed border-gray-300 w-full" />
        </div>
        <div className="flex-1 flex flex-row items-center gap-1">
          <div className="flex flex-row-reverse items-center">
            <CheckCircle className={`w-6 h-6 text-gray-400`} />
            <p className="text-xs hidden lg:flex w-max">تحویل سفارش</p>
          </div>
          <hr className="border-dashed border-gray-300 w-full" />
        </div>
      </div>
      {/* <address>{branch.address}</address> */}

      {/* <div className="flex flex-row">
        <h4>Food Items:</h4>
        {foods.length > 0 ? (
          foods.map((food) => (
            <div key={food.id} className="food-item">
              <Image
                width={100}
                height={100}
                quality={80}
                src={food.url}
                alt={food.id}
              />
              <p>Price: {food.price}</p>
              <p>Quantity: {food.quantity}</p>
            </div>
          ))
        ) : (
          <p>No food items available.</p>
        )}
      </div> */}

      {/* <div className="mt-4">
        <Button>Order Now</Button>
        <Button>Cancel</Button>
      </div> */}
    </div>
  );
};

export default FoodCard;
