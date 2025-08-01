"use client";

import { useState } from "react";
import * as z from "zod";
import Image from "next/image";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

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
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

// Form validation schema
const formSchema = z.object({
  mobile: z
    .string()
    .min(11, { message: "شماره همراه نامعتبر است" })
    .max(11, { message: "شماره همراه نامعتبر است" }),
  password: z.string().min(8, {
    message: "لطفا رمز عبور پیچیده تر انتخاب کنید شامل حداقل 8 کاراکتر",
  }),
});

export const AuthModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Use new auth context instead of old Redux state
  const { login, register, loading: authLoading } = useAuth();

  // Get modal state from Redux store
  const { isOpen, level } = useSelector((state: RootState) => state.auth);

  const [sendedPhone, setSendedPhone] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  // Updated login handler using new auth context
  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setLocalLoading(true);
    setSendedPhone(values?.mobile);

    try {
      // Use the auth context login function
      await login(values.mobile, values.password);

      // Close the modal after successful login
      dispatch(onClose());

      // The redirect will happen automatically from the auth context
      // or middleware will handle it when user tries to access routes
    } catch (error) {
      // Error is already handled in auth context with toast
      console.error("Login failed:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Updated register handler using new auth context
  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    setLocalLoading(true);
    setSendedPhone(values?.mobile);

    const userData = {
      mobile: values?.mobile,
      password: values?.password,
      __t: "user", // Keep this if your backend expects it
    };

    try {
      // Use the auth context register function
      await register(userData);

      // Close the modal after successful registration
      dispatch(onClose());

      // The redirect will happen automatically from the auth context
    } catch (error) {
      // Error is already handled in auth context with toast
      console.error("Registration failed:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Combined loading state
  const isLoading = authLoading || localLoading;

  return (
    <Modal
      title={loginForm ? "ورود" : "ثبت نام"}
      description={
        level == 1
          ? "شماره همراه خود را وارد کنید"
          : `کد شش رقمی به شماره ${sendedPhone} ارسال شد`
      }
      isOpen={isOpen}
      onClose={() => dispatch(onClose())}
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
                          autoComplete="off"
                          disabled={isLoading}
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
                          autoComplete="off"
                          type="password"
                          disabled={isLoading}
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
                  type="submit"
                  className="bg-main text-white w-1/2 mx-auto hover:bg-main shadow-md hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading
                    ? loginForm
                      ? "در حال ورود..."
                      : "در حال ثبت نام..."
                    : loginForm
                    ? "ورود"
                    : "ثبت نام"}
                </Button>
              </form>
            </Form>
          ) : (
            <OTPForm loading={isLoading} />
          )}
        </div>
      </div>
    </Modal>
  );
};
