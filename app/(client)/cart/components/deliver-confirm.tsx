import React, {
  ChangeEvent,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CarFront, MapPin, NotebookPen, PlusCircle } from "lucide-react";
import { onOpen } from "@/hooks/use-address-modal";
import { RootState } from "@/hooks/store";
import { useDispatch, useSelector } from "react-redux";
import { DeleteAddress, getAddresses } from "@/services/address-service";
import { setAddresses } from "@/hooks/use-address";
import AddressCard from "./address-card";
import { AlertModal } from "@/components/modals/alert-modal";
import { toast } from "sonner";
import axios from "axios";
import { logout } from "@/hooks/use-user";
import { setAddressId, setDeliveryType } from "@/hooks/use-cart";
import { CartAddressCard } from "@/components/skeleton";

const DeliverConfirm = () => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state: RootState) => state.userAddress);
  const { userId, token } = useSelector((state: RootState) => state.user);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isDelivery, setIsDelivery] = useState(1);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await getAddresses(userId);
      dispatch(setAddresses(response));
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleDeleteAddress = async (id: string) => {
    setLoading(true);
    const loadingToastId = toast.loading("در حال پردازش"); // Show loading toast and save its ID

    try {
      const response = await DeleteAddress(id, token);

      if (response.data.ok) {
        toast.dismiss(loadingToastId); // Dismiss loading toast on success
        toast.success(response.data.message);
      } else {
        toast.dismiss(loadingToastId); // Dismiss loading toast on error
        toast.error(response.data.message);
      }

      setOpen(false);
      fetchAddresses(); // Refresh the addresses after deletion
    } catch (error) {
      toast.dismiss(loadingToastId); // Dismiss loading toast on error
      handleError(error); // Handle the error if one occurs
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 403) dispatch(logout());
      else if (status === 401)
        toast.error("ابتدا باید وارد حساب کاربری خود شوید");
      else toast.error(data?.message || "An error occurred");
    }
  };

  const handleSelectAddressToDelete = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleSelectAddress = (id: string) => {
    dispatch(setAddressId(id));
    setSelectedAddress(selectedAddress === id ? "" : id);
  };

  const handleSelectDeliveryType = (e: ChangeEvent<HTMLInputElement>) => {
    setIsDelivery(Number(e.target.value));
    dispatch(setDeliveryType(e.target.value));
  };

  if (!addresses) return <CartAddressCard />;

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleDeleteAddress(selectedId)}
        loading={loading}
      />

      <section className="w-full">
        <div className="w-[95%] min-h-[130px] px-4 py-2 mx-auto border border-gray-200 rounded-md flex flex-col items-end justify-around">
          <div className="flex flex-row items-center">
            روش تحویل سفارش
            <CarFront className="h-6 w-6 text-gray-700 ml-1" />
          </div>
          <Separator />
          <div className="flex flex-row-reverse items-center gap-4">
            <label
              htmlFor="deliver-one"
              className="text-sm flex items-center text-gray-600"
            >
              ارسال توسط پیک
              <input
                className="ml-1 w-4 h-4"
                id="deliver-one"
                name="deliver-type"
                type="radio"
                value="1"
                onChange={handleSelectDeliveryType}
              />
            </label>
            <label
              htmlFor="deliver-two"
              className="text-sm flex items-center text-gray-600"
            >
              تحویل حضوری
              <input
                className="ml-1 w-4 h-4"
                id="deliver-two"
                name="deliver-type"
                type="radio"
                value="2"
                onChange={handleSelectDeliveryType}
              />
            </label>
          </div>
        </div>

        <div className="w-[95%] min-h-[130px] px-4 py-6 mx-auto border border-gray-200 rounded-md flex flex-col mt-1 items-center justify-between">
          {isDelivery === 1 ? (
            <>
              <div className="flex flex-row w-full justify-between">
                <Button
                  onClick={() => dispatch(onOpen(null))}
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
              <div className="py-8 w-full flex flex-row flex-wrap gap-1 items-center justify-end">
                {Array.isArray(addresses) && addresses.length > 0 ? (
                  addresses.map((item, index) => (
                    <AddressCard
                      key={index}
                      data={item}
                      handleSelectAddressToDelete={handleSelectAddressToDelete}
                      handleSelectAddress={handleSelectAddress}
                      selectedAddress={selectedAddress}
                    />
                  ))
                ) : (
                  <p className="text-gray-600 text-center mx-auto text-xs lg:text-sm">
                    !شما در حال حاضر هیچ آدرسی ثبت نکرده‌اید
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-row-reverse text-left w-full text-base text-gray-900">
                <MapPin className="w-5 h-5 text-gray-800" />
                <h1>آدرس شعبه</h1>
                <p>اکباتان</p>
              </div>
              <div className="flex flex-col items-end text-right w-full text-sm text-gray-600">
                <p>
                  اکباتان، خیابان ریاحی، کوچه سیزدهم، ساختمان آیسا، طبقه همکف
                </p>
                <p>شماره تماس ۱: ۱۲۵۴ ۵۴۸۹ -۰۲۱</p>
                <p>شماره تماس ۲: ۱۲۵۵ ۵۴۸۹ -۰۲۱ </p>
                <p>ساعت کاری: همه‌روزه از ساعت ۱۲ تا ۲۳ بجز روزهای تعطیل</p>
              </div>
              <Button className="bg-white text-gray-500 hover:text-gray-500 hover:bg-white border-2 border-gray-400 shadow-md hover:shadow-xl w-[152px] h-[32px] p-2 mt-4 mr-10 self-end">
                مشاهده در نقشه
              </Button>
            </>
          )}
        </div>

        <div className="w-[95%] min-h-[100px] px-4 py-2 mx-auto border border-gray-200 rounded-md flex flex-col mt-1 items-end justify-start">
          <div className="flex flex-row-reverse gap-1 items-center">
            <NotebookPen className="h-5 w-5" />
            <h2>توضیحات سفارش</h2>
            <p className="text-sm text-gray-500">(اختیاری)</p>
          </div>
          <Textarea
            className="bg-none resize-none mt-2"
            dir="rtl"
            placeholder="توضیحات در مورد سفارش را اینجا بنویس :)"
          />
        </div>
      </section>
    </>
  );
};

export default DeliverConfirm;
