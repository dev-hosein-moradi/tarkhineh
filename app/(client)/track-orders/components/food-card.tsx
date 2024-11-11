import { useEffect, useState } from "react";
import { getBranchById } from "@/services/branch-service";
import { getFoodById } from "@/services/food-service";
import { UserOrder } from "@/hooks/use-order";
import {
  BadgeDollarSign,
  CalendarClock,
  CarFront,
  CheckCircle,
  Clock,
  Home,
  MapPin,
} from "lucide-react";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { OrderCardSkeleton } from "@/components/skeleton";
dayjs.extend(utc);
dayjs.extend(jalaliday);

interface FoodCardProps {
  order: UserOrder;
}

interface Branch {
  id: string;
  name: string;
  address: string;
}

interface Food {
  id: string;
  name: string;
  image: string;
  mainPrice: string;
  discountPrice: string;
  quantity: number;
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

const FoodCard: React.FC<FoodCardProps> = ({ order }) => {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranchAndFoods = async () => {
      try {
        setLoading(true);
        const branchPromise = getBranchById(order.branchId);
        const foodPromises = order.foods.map((foodItem) =>
          getFoodById(foodItem.id)
        );

        const [branchResponse, foodResponses] = await Promise.all([
          branchPromise,
          Promise.all(foodPromises),
        ]);

        setBranch(branchResponse.data.data); // Assume branch data is in `data.data`

        // Map each food item to include quantity from `order.foods`
        const foodsWithQuantity = foodResponses.map((res) => {
          const foodData = res.data.data;
          const quantity =
            order.foods.find((item) => item.id === foodData.id)?.quantity || 0;
          return { ...foodData, quantity };
        });

        setFoods(foodsWithQuantity);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("در دریافت سفارشات مشکلی پیش آمده است");
      } finally {
        setLoading(false);
      }
    };

    fetchBranchAndFoods();
  }, [order]);

  const formattedDate = dayjs
    .utc(order.time)
    .calendar("jalali")
    .locale("fa")
    .format("dddd D MMMM، ساعت HH:mm");

  if (loading) return <OrderCardSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <div className="border rounded shadow p-4 w-full flex flex-col gap-3 bg-gray-50">
      <div className="w-full flex flex-row-reverse items-center justify-between">
        <h3 className="text-lg font-medium">{branch?.name}</h3>
        <div className="flex flex-row-reverse items-center gap-2">
          {/* Delivery type */}
          <span className="text-xs bg-gray-100 p-2 rounded-md">
            {order.userAddress.length > 0 ? "ارسال توسط پیک" : "تحویل حضوری"}
          </span>
          {/* Status */}
          <span
            className={`text-${statusColorDict[Number(order.status)]} bg-${
              statusBgColorDict[Number(order.status)]
            } text-xs p-2 rounded-md`}
          >
            {statusDict[Number(order.status)]}
          </span>
        </div>
      </div>

      <div className="flex flex-row-reverse items-center justify-center sm:justify-between flex-wrap gap-2">
        <div className="w-full sm:w-max text-center flex flex-row-reverse items-center justify-start sm:justify-normal gap-2 text-sm text-gray-800">
          <CalendarClock className="w-4 h-4 text-gray-400" />
          {formattedDate}
        </div>
        <div className="w-full sm:w-max flex flex-row-reverse items-center justify-start sm:justify-normal text-sm text-gray-800 gap-2">
          <BadgeDollarSign className="w-4 h-4 text-gray-400" />
          <p>مبلغ: {Number(order.price).toLocaleString("fa-IR")}</p>
          <p>تخفیف: {Number(order.discount).toLocaleString("fa-IR")}</p>
        </div>
        <div className="w-full sm:w-max flex flex-row-reverse items-center justify-start sm:justify-normal text-sm text-gray-800 gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          تحویل تا
          <p className="text-main">
            {"24:12"
              .split(":")
              .map(Number)
              .map((n) => n.toLocaleString("fa-IR"))
              .join(":")}
          </p>
        </div>
      </div>

      <address className="text-right text-sm text-gray-800 flex flex-row-reverse gap-2">
        <MapPin className="w-4 h-4 text-gray-400" />
        {branch?.address}
      </address>

      <div className="w-full flex flex-row-reverse item-center justify-center flex-nowrap my-4">
        <div className="flex-1 flex flex-row items-center gap-1">
          <hr
            className={`${
              Number(order.status) >= 1 ? "border-main" : "border-gray-300"
            } border-dashed w-full`}
          />
          <div className="flex flex-row-reverse items-center">
            <Home
              className={`w-6 h-6 ${
                Number(order.status) >= 1 ? "text-main" : "text-gray-300"
              }`}
            />
            <p className="text-sm hidden lg:flex w-max">در حال آماده سازی</p>
          </div>
        </div>
        <div className="flex-1 flex flex-row items-center gap-1">
          <hr
            className={`border-dashed ${
              Number(order.status) >= 2 ? "border-main" : "border-gray-300"
            } w-full`}
          />
          <div className="flex flex-row-reverse items-center">
            <CarFront
              className={`w-6 h-6 ${
                Number(order.status) >= 2 ? "text-main" : "text-gray-300"
              }`}
            />
            <p className="text-sm hidden lg:flex w-max">ارسال توسط پیک</p>
          </div>
          <hr
            className={`border-dashed ${
              Number(order.status) >= 2 ? "border-main" : "border-gray-300"
            } w-full`}
          />
        </div>
        <div className="flex-1 flex flex-row items-center gap-1">
          <div className="flex flex-row-reverse items-center">
            <CheckCircle
              className={`w-6 h-6 ${
                Number(order.status) === 3 ? "text-main" : "text-gray-300"
              }`}
            />
            <p className="text-sm hidden lg:flex w-max">تحویل سفارش</p>
          </div>
          <hr
            className={`border-dashed ${
              Number(order.status) >= 3 ? "border-main" : "border-gray-300"
            } w-full`}
          />
        </div>
      </div>

      <div className="flex flex-row-reverse gap-2 items-center overflow-x-auto overflow-y-hidden py-2">
        {foods.length > 0 ? (
          foods.map((food) => (
            <div
              key={food.id}
              className="food-item w-[150px] min-w-[150px] border rounded-md flex flex-col items-center relative bg-white pb-1"
            >
              <Image
                className="mx-auto rounded mt-1 w-[140px] object-cover"
                width={100}
                height={100}
                quality={80}
                src={food.image}
                alt={food.id}
              />
              <p className="text-sm">{food.name}</p>
              <p className="text-xs text-gray-800" dir="rtl">
                {food.mainPrice || food.discountPrice} تومان
              </p>
              <p className="bg-white text-main absolute p-1 rounded-md left-[7px] top-2 text-sm">
                x{food.quantity}
              </p>
            </div>
          ))
        ) : (
          <p>خطا در دریافت محصولات سفارش شما</p>
        )}
      </div>

      <div className="mt-4 flex flex-row w-full items-center gap-2">
        {Number(order.status) > 3 ? (
          <Button className="text-main border-main border-[2px] bg-white hover:bg-white hover:shadow-md">
            سفارش مجدد
          </Button>
        ) : (
          Number(order.status) === 1 && (
            <Button className="text-error border-error border-[2px] bg-white hover:bg-white hover:shadow-md">
              لغو سفارش
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default FoodCard;
