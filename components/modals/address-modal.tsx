"use client";

import { useState } from "react";
import * as z from "zod";

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
import { useAddressModal } from "@/hooks/use-address-modal";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const formSchema = z.object({
  title: z.string().min(4),
  reciver: z.string(),
  reciverName: z.string(),
  reciverPhone: z.string(),
  phone: z.string(),
  address: z.string().min(4),
});

export const AddressModal = () => {
  const addressModal = useAddressModal();
  const [isReciver, setIsReciver] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      reciver: "",
      reciverName: "",
      reciverPhone: "",
      phone: "",
      address: "",
    },
  });

  return (
    <Modal
      title="آدرس"
      description="ثبت یا ویرایش آدرس"
      isOpen={addressModal.isOpen}
      onClose={addressModal.onClose}
    >
      <div>
        <Separator className="mb-4" />
        <div className="space-y-4 py-2 pb-4 flex-row-reverse">
          <Form {...form}>
            <form>
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
                      <Input
                        className="w-4 space-y-0"
                        onClick={() => {
                          setIsReciver(!isReciver);
                        }}
                        checked
                        type="checkbox"
                        dir="rtl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isReciver ? (
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="my-1">
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="شماره همراه"
                          dir="rtl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center justify-around mt-6">
                <Button className="flex-1 bg-main text-white hover:bg-main hover:text-white hover:shadow-md">
                  ثبت آدرس
                </Button>
                <Button className="flex-1 bg-white text-main hover:bg-white hover:text-main hover:shadow-md shadow-none">
                  ویرایش آدرس انتخابی
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
