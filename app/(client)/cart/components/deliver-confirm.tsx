import { Button } from "@/components/ui/button";
import { CarFront, MapPin, PlusCircle } from "lucide-react";
import React from "react";

const DeliverConfirm = () => {
  return (
    <section className="w-full">
      <div className="w-[95%] min-h-[130px] px-4 py-6 mx-auto border-[1px] border-gray-200 rounded-md flex flex-row-reverse items-center justify-around">
        <div className="flex flex-row items-center">
          روش تحویل سفارش
          <CarFront className="h-6 w-6 text-gray-700 ml-1" />
        </div>
        <label htmlFor="deliver-one" className="">
          ارسال توسط پیک
          <input
            className="ml-1 w-4 h-4"
            id="deliver-one"
            name="deliver-type"
            type="radio"
          />
        </label>
        <label htmlFor="deliver-two" className="">
          تحویل حضوری
          <input
            className="ml-1 w-4 h-4"
            id="deliver-two"
            name="deliver-type"
            type="radio"
          />
        </label>
      </div>

      <div className="w-[95%] min-h-[130px] px-4 py-6 mx-auto border-[1px] border-gray-200 rounded-md flex flex-row-reverse items-center justify-around">
        <div className="flex flex-row w-full justify-between">
          <Button className="bg-white text-main hover:bg-white">
            <PlusCircle className="w-4 h-4" />
            افزودن آدرس
          </Button>
          <h2 className="flex flex-row items-center">
            آدرس ها
            <MapPin className="w-5 h-5 text-gray-800" />
          </h2>
        </div>
      </div>

      <div></div>
    </section>
  );
};

export default DeliverConfirm;
