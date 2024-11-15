"use client";

import { useState } from "react";
import * as z from "zod";
import Image from "next/image";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";

import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Logo from "@/public/image/Logo.svg";
import OTPForm from "../otp-form";
import { RootState } from "@/hooks/store";
import { onClose, nextLevel, prevLevel } from "@/hooks/use-auth-modal";
import { toast } from "sonner";
import { setToken } from "@/hooks/use-user";
import { LoginUser, RegisterUser } from "@/services/auth-service";
import { Checkbox } from "@/components/ui/checkbox";

// Form validation schema
const formSchema = z.object({
  mobile: z
    .string()
    .min(11, { message: "شماره همراه نامعتبر است" })
    .max(11, { message: "شماره همراه نامعتبر است" }),
  password: z.string().min(8, {
    message: " لطفا رمز عبور پیچیده تر انتخاب کنید شامل حداقل 8 کاراکتر",
  }),
});

export const AuthModal = () => {
  const dispatch = useDispatch();

  // Get modal state from Redux store
  const { isOpen, level } = useSelector((state: RootState) => state.auth);

  const [sendedPhone, setSendedPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  // Handle sending the phone number and navigating to the next level
  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setSendedPhone(values?.mobile);
    const data = {
      mobile: values?.mobile,
      password: values?.password,
    };

    try {
      const response = await LoginUser(data);
      if (response.data.ok) {
        dispatch(setToken(response.data.data));
        toast.success(`ورود با موفقیت انجام شد`);
        dispatch(onClose());
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setSendedPhone(values?.mobile);

    const data = {
      mobile: values?.mobile,
      password: values?.password,
      __t: "user"
    };

    try {
      const response = await RegisterUser(data);
      if (response.data.ok) {
        dispatch(setToken(response.data.data));
        toast.success(`ثبت نام با موفقیت انجام شد`);
        dispatch(onClose());
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data.message;
      toast.error(errorMessage || "An error occurred");
    }
  };

  return (
    <Modal
      title={loginForm ? "ورود" : "ثبت نام"}
      description={
        level == 1
          ? "شماره همراه خود را وارد کنید"
          : `کد شش رقمی به شماره ${sendedPhone} ارسال شد`
      }
      isOpen={isOpen} // Get from Redux store
      onClose={() => dispatch(onClose())} // Dispatch close action
    >
      <div>
        <div className="w-full flex items-center justify-center py-8">
          <Image
            src={Logo}
            alt="logo"
            className="w-[150px] h-[38px] md:h-[42px] lg:h-[50px]"
            priority
            width={100}
            height={100}
            quality={100}
          />
        </div>
        <div className="space-y-4 py-2 pb-4 flex-col w-full">
          {level == 1 ? (
            <Form {...form}>
              <form
                className="flex flex-col items-center w-full"
                onSubmit={
                  loginForm
                    ? form.handleSubmit(handleLogin)
                    : form.handleSubmit(handleRegister)
                }
              >
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="w-full mb-2">
                      <FormControl className="w-full">
                        <Input
                          className="w-full"
                          dir="rtl"
                          placeholder="شماره همراه"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="w-full">
                        <Input
                          className="w-full"
                          dir="rtl"
                          placeholder="رمز عبور"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-row-reverse text-right w-full items-center pt-2">
                  <label
                    htmlFor="terms"
                    className="text-sm text-blue-600 cursor-pointer py-2 text-right w-full ml-auto font-medium leading-none"
                    onClick={() => setLoginForm(!loginForm)}
                  >
                    {loginForm
                      ? "ثبت نام کاربر جدید"
                      : "آیا حساب کاربری دارید؟"}
                  </label>
                </div>

                <Separator className="my-4" />
                <Button
                  className="bg-main text-white w-1/2 mx-auto hover:bg-main shadow-md hover:shadow-xl"
                  disabled={loading}
                >
                  {loginForm ? "ورود" : "ثبت نام"}
                </Button>
              </form>
            </Form>
          ) : (
            <OTPForm loading={loading} />
          )}
        </div>
      </div>
    </Modal>
  );
};
