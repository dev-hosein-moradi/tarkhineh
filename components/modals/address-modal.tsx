"use client";

import { useCallback, useEffect, useState } from "react";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { onClose } from "@/hooks/use-address-modal";
import { RootState } from "@/hooks/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  addAddress,
  EditAddress,
  getAddress,
  getAddresses,
} from "@/services/address-service";
import { IAddress } from "@/types";
import { logout } from "@/hooks/use-user";
import { setAddresses } from "@/hooks/use-address";

const formSchema = z.object({
  title: z.string().min(4),
  reciver: z.boolean(),
  reciverName: z.string().optional(),
  reciverPhone: z.string(),
  address: z.string().min(4),
});

export const AddressModal = ({ id }: { id?: string }) => {
  const dispatch = useDispatch();

  const { isOpen, selectedId } = useSelector(
    (state: RootState) => state.address
  );
  const { userId, token, mobileNumber } = useSelector(
    (state: RootState) => state.user
  );

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      reciver: true,
      reciverName: "",
      reciverPhone: mobileNumber || "",
      address: "",
    },
  });

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

  const handleSendAddress = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const loadingToastId = toast.loading("در حال پردازش");

    try {
      const address: IAddress = {
        id: uuidv4(),
        title: values.title,
        content: values.address,
        tel: values.reciver ? mobileNumber : values.reciverPhone,
        userId: userId,
        isReciver: values.reciver,
      };

      const response = await addAddress(address, token);

      if (response.data.ok) {
        toast.dismiss(loadingToastId);
        toast.success(response.data.message);
        fetchAddresses()
      } else {
        toast.dismiss(loadingToastId);
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const loadingToastId = toast.loading("در حال پردازش");

    try {
      const address: IAddress = {
        id: selectedId || uuidv4(),
        title: values.title,
        content: values.address,
        tel: values.reciver ? mobileNumber : values.reciverPhone,
        userId: userId,
        isReciver: values.reciver,
      };

      const response = await EditAddress(address, token);

      if (response.data.ok) {
        toast.dismiss(loadingToastId); // Dismiss loading toast on success
        toast.success(response.data.message);
        dispatch(onClose()); // Close the modal
        fetchAddresses()
      } else {
        toast.dismiss(loadingToastId); // Dismiss loading toast on error
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss(loadingToastId); // Dismiss loading toast in case of error
      handleError(error);
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data.message;
      if (statusCode === 403) dispatch(logout());
      else if (statusCode === 401)
        toast.error("ابتدا باید وارد حساب کاربری خود شوید");
      else toast.error(errorMessage || "An error occurred");
    }
  };

  // Fetch the address to edit if selectedId is available
  useEffect(() => {
    const getExistAddressToEdit = async () => {
      try {
        if (selectedId) {
          const response = await getAddress(selectedId);
          form.reset({
            title: response.title,
            reciver: response.isReciver,
            reciverName: response.reciverName || "",
            reciverPhone: response.tel,
            address: response.content,
          });
        }
      } catch (error) {
        toast.error("در دریافت آدرس مورد نظر مشکلی رخ داده است");
      }
    };

    if (selectedId) {
      getExistAddressToEdit();
    } else {
      form.reset({ title: "", reciver: true, address: "" });
    }
  }, [form, selectedId]);

  return (
    <Modal
      title="آدرس"
      description="ثبت یا ویرایش آدرس"
      isOpen={isOpen}
      onClose={() => {
        dispatch(onClose());
        form.reset({ title: "", reciver: true, address: "" });
      }}
    >
      <div>
        <Separator className="mb-4" />
        <div className="space-y-4 py-2 pb-4 flex-row-reverse">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                selectedId ? handleEditAddress : handleSendAddress
              )}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="my-1">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="عنوان آدرس"
                        dir="rtl"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reciver"
                render={({ field }) => (
                  <FormItem className="my-1 flex flex-row items-center justify-end text-right">
                    <FormLabel className="mr-2 text-gray-800">
                      تحویل گیرنده خودم هستم
                    </FormLabel>
                    <FormControl className="w-6">
                      <Checkbox
                        className="w-5 h-5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!form.getValues("reciver") && (
                <>
                  <FormField
                    control={form.control}
                    name="reciverName"
                    render={({ field }) => (
                      <FormItem className="my-1">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="نام و نام‌خانوادگی تحویل گیرنده"
                            dir="rtl"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reciverPhone"
                    render={({ field }) => (
                      <FormItem className="my-1">
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="شماره همراه تحویل گیرنده"
                            dir="rtl"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="my-1">
                    <FormControl>
                      <Textarea
                        rows={4}
                        dir="rtl"
                        className="resize-none"
                        placeholder="آدرس دقیق شما"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center justify-around mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-main text-white hover:bg-main hover:text-white hover:shadow-md"
                >
                  {selectedId ? "ویرایش آدرس انتخابی" : "ثبت آدرس"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
