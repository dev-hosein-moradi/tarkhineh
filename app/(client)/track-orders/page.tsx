"use client";

import { Separator } from "@/components/ui/separator";
import FilterBar from "./components/filter-bar";
import { Suspense, useEffect, useState } from "react";
import { getOrdersByUser } from "@/services/order-service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/hooks/store";
import { setOrders, UserOrder } from "@/hooks/use-order";
import FoodCard from "./components/food-card";

export default function TrackOrders() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.userOrder);

  const [filteredOrders, setFilteredOrders] = useState<UserOrder[]>([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await getOrdersByUser(userId);
        if (response.data.ok) {
          dispatch(setOrders(response.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
  }, [dispatch, userId]);

  const handleFilterChange = (selectedFilter: string | null) => {
    if (!selectedFilter) {
      setFilteredOrders(orders || []);
    } else {
      const newFilteredFoods = orders?.filter(
        (order) => order.status === selectedFilter
      );
      setFilteredOrders(newFilteredFoods || []);
    }
  };

  return (
    <section className="w-full max-w-[1350px] px-[5%] mx-auto">
      <div className="w-full border rounded flex flex-col items-end px-4 py-2">
        <h2 className="text-base font-medium">سفارشات</h2>
        <Separator />
        <FilterBar onFilterChange={handleFilterChange} />
        <Suspense fallback={<>loading food card...</>}>
          <div className="w-full">
            {orders.map((item, index) => (
              <FoodCard key={item.id} data={item} />
            ))}
          </div>
        </Suspense>
      </div>
    </section>
  );
}
