import { CheckCircle, NotebookText, UserCheck, Wifi } from "lucide-react";

export default function QuickAbout() {
  return (
    <div className="summery_bg w-full min-h-[720px] sm:min-h-[420px] md:min-h-[280px] py-[24px]">
      <div className="w-full max-w-[1150px] mx-auto flex flex-col md:flex-row-reverse md:items-center md:justify-between">
        <div className="text-white text-right flex flex-col md:w-[50%] lg:w-[45%]">
          <h2 className="font-normal text-xl mb-4">
            رستوران‌های زنجیره‌ای ترخینه
          </h2>

          <p className="font-normal text-[13px] sm:text-[15px] md:text-sm leading-6 md:leading-7 break-normal ">
            مهمان‌نوازی یکی از مهم‌ترین مشخصه‌های ایرانیان است و باعث افتخار
            ماست که بیش از 20 سال است خدمت‌گزار مردم شریف ایران هستیم. ما در
            رستوران‌های زنجیره‌ای ترخینه همواره تلاش کردیم که در محیطی اصیل بر
            پایه معماری و طراحی مدرن در کنار طبیعتی دلنواز، غذایی سالم و
            درخورشان شما عزیزان ارائه دهیم
          </p>

          <button className="border-[1px] border-white w-[150px] h-[35px] font-normal text-[14px] rounded-md mt-4 ">
            اطلاعات بیشتر
          </button>
        </div>

        <div className="flex flex-row-reverse justify-center items-center flex-wrap mt-4 gap-1 md:w-[50%] lg:justify-end">
          <span className="text-white my-2 w-[140px] py-8 px-1 text-center flex flex-col-reverse items-center border rounded-md  ">
            <p className="font-normal text-[13px] mt-1 ">
              پرسنلی مجرب و حرفه‌ای
            </p>
            <UserCheck className="w-5 h-5 text-white" />
          </span>

          <span className="text-white my-2 w-[140px] py-8 px-1 text-center flex flex-col-reverse items-center border rounded-md  ">
            <p className="font-normal text-[13px] mt-1 ">کیفیت بالای غذاها</p>
            <CheckCircle className="w-5 h-5 text-white" />
          </span>

          <span className="text-white my-2 w-[140px] py-8 px-1 text-center flex flex-col-reverse items-center border rounded-md  ">
            <p className="font-normal text-[13px] mt-1 ">محیطی دلنشین و آرام</p>
            <Wifi className="w-5 h-5 text-white" />
          </span>

          <span className="text-white my-2 w-[140px] py-8 px-1 text-center flex flex-col-reverse items-center border rounded-md  ">
            <p className="font-normal text-[13px] mt-1 ">منوی متنوع</p>
            <NotebookText className="w-5 h-5 text-white" />
          </span>
        </div>
      </div>
    </div>
  );
}
