"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  fullname: z.string().min(2).max(50),
  phone: z.string().min(11).max(11),
  email: z.string().email(),
  message: z.string().min(3).max(200),
});

export default function FooterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="text-white lg:flex flex-col items-cente hidden w-[60%]">
      <h2 className="font-bold text-xl leading-7 ml-auto text-right mb-4 w-full">
        پیام به ترخینه{" "}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row"
          dir="rtl"
        >
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-transparent w-[270px] h-[40px] text-[15px] font-normal border-[1px] border-gray-6 hover:border-gray-1 my-1 rounded-md outline-none rtl-grid text-white px-4 py-1 focus:border-gray-1  "
                      placeholder="نام و نام خانوادگی"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-transparent w-[270px] h-[40px] text-[15px] font-normal border-[1px] border-gray-6 hover:border-gray-1 my-1 rounded-md outline-none rtl-grid text-white px-4 py-1 focus:border-gray-1  "
                      placeholder="شماره تماس (اختیاری)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-transparent w-[270px] h-[40px] text-[15px] font-normal border-[1px] border-gray-6 hover:border-gray-1 my-1 rounded-md outline-none rtl-grid text-white px-4 py-1 focus:border-gray-1  "
                      placeholder="ایمیل"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="bg-transparent w-[300px] h-[135px] text-[15px] font-normal border-[1px] border-gray-6  hover:border-gray-1 my-1 mr-2 rounded-md resize-none outline-none rtl-grid text-white px-4 py-1 focus:border-gray-1 "
                      placeholder="پیام خود را بنویسید"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="bg-transparent hover:bg-main border-[1px] border-gray-6 w-[183px] h-[40px] mr-auto my-2 rounded-md hover:footer-link-hover active:footer-link-hover">
              ارسال پیام
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
