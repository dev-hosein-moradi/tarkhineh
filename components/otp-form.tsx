"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { RootState } from "@/hooks/store";
import { useDispatch, useSelector } from "react-redux";
import { onClose, onOpen, prevLevel } from "@/hooks/use-auth-modal";

const formSchema = z.object({
  pin: z.string().min(6, {
    message: "تعداد کاراکتر وارد شده نامعتبر است",
  }),
});
export default function OTPForm({ loading }: { loading: boolean }) {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleConfirmAuth = (values: z.infer<typeof formSchema>) => {
    if (values.pin !== "111111") {
      form.setError("pin", {
        type: "manual",
        message: "کد وارد شده نامعتبر است",
      });
      return;
    }
    dispatch(onClose());
    dispatch(prevLevel());
  };

  const handleEditPhone = () => {
    dispatch(prevLevel());
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center w-full"
        onSubmit={form.handleSubmit(handleConfirmAuth)}
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
        <Separator className="my-4" />
        <div className="flex flex-col w-full">
          <div className="flex flex-row-reverse flex-wrap w-full items-center justify-around">
            <Button
              className="bg-main text-white w-1/3 hover:bg-main shadow-md hover:shadow-xl"
              disabled={loading}
            >
              تائید
            </Button>
            <Button
              variant="outline"
              className="bg-white text-gray-800"
              disabled={loading}
              onClick={handleEditPhone}
            >
              ویرایش شماره همراه
            </Button>
          </div>
          <p className="flex flex-row-reverse items-center justify-start w-full text-right text-sm text-warning pt-2">
            <Info className="w-4 h-4 text-warning ml-1" />
            جهت ورود آزمایشی کد 111-111 را وارد کنید
          </p>
        </div>
      </form>
    </Form>
  );
}
