"use client";

import { getFoods } from "@/services/food-service";
import { IFood } from "@/types";
import { useEffect, useState } from "react";

export function useFoods() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const fetchedFoods = await getFoods();
        setFoods(fetchedFoods);
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchFoods();
  }, []);

  return { foods, error };
}
