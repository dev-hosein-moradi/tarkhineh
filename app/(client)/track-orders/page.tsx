"use client";

import { Separator } from "@/components/ui/separator";
import FilterBar from "./components/filter-bar";
import { Suspense, useEffect, useState } from "react";
import { getOrdersByUser } from "@/services/order-service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/hooks/store";
import { setOrders, UserOrder } from "@/hooks/use-order";
import dynamic from "next/dynamic";
import { OrderCardsSkeleton } from "@/components/skeleton";

// Dynamically import FoodCard for code splitting
const FoodCard = dynamic(() => import("./components/food-card"), {
  suspense: true,
});

export default function TrackOrders() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.userOrder);

  const [filteredOrders, setFilteredOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrdersByUser(userId);
        if (response.data.ok) {
          dispatch(setOrders(response.data.data));
          setFilteredOrders(response.data.data); // Initially display all orders
        } else {
          setError("Failed to load orders");
        }
      } catch (error) {
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getOrders();
    }
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

  if (loading) return <OrderCardsSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <section className="w-full max-w-[1350px] min-h-[510px] my-2 px-[5%] mx-auto">
      <div className="w-full border rounded flex flex-col items-end px-4 py-2">
        <h2 className="text-xl font-medium">سفارشات</h2>
        <Separator />
        <FilterBar onFilterChange={handleFilterChange} />
        <Suspense fallback={<OrderCardsSkeleton />}>
          <div className="w-full flex flex-row-reverse flex-wrap gap-2">
            {filteredOrders.map((item) => (
              <FoodCard key={item.id} order={item} />
            ))}
          </div>
        </Suspense>
      </div>
    </section>
  );
}
