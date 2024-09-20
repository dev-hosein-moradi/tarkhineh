import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAddressModal } from "@/hooks/use-address-modal";
import { CarFront, MapPin, NotebookPen, PlusCircle } from "lucide-react";
import React from "react";

const DeliverConfirm = () => {
  const addressModal = useAddressModal();
  const handleOpenAddressModal = () => {
    addressModal.onOpen();
  };
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

      <div className="w-[95%] min-h-[130px] px-4 py-6 mx-auto border-[1px] border-gray-200 rounded-md flex flex-col mt-1 items-center justify-around">
        <div className="flex flex-row w-full justify-between">
          <Button
            onClick={handleOpenAddressModal}
            className="bg-white text-main hover:bg-white"
          >
            <PlusCircle className="w-4 h-4" />
            افزودن آدرس
          </Button>
          <h2 className="flex flex-row items-center">
            <MapPin className="w-5 h-5 text-gray-800" />
            آدرس ها
          </h2>
        </div>
        <Separator className="mt-2" />
        <div className="py-8">
          <p className="text-gray-600">
            !شما در حال حاضر هیچ آدرسی ثبت نکرده‌اید
          </p>
        </div>
      </div>

      <div className="w-[95%] min-h-[100px] px-4 py-2 mx-auto border-[1px] border-gray-200 rounded-md flex flex-col mt-1 items-end justify-start">
        <div className="flex flex-row-reverse gap-1 items-center">
          <NotebookPen className="h-5 w-5" />
          <h2>توضیحات سفارش</h2>
          <p className="text-sm text-gray-500">(اختیاری)</p>
        </div>
        <Textarea className="bg-none resize-none mt-2" dir="rtl" />
      </div>
    </section>
  );
};

export default DeliverConfirm;
