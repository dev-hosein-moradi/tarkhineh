("");

import FooterBg from "@/public/image/footer.webp";
import Image from "next/image";
import FooterForm from "./footer-form";

export default function Footer() {
  return (
    <div className="relative bg-blend-darken w-full h-[300px]">
      <Image
        src={FooterBg}
        alt="footer background image"
        className="absolute w-full h-full object-cover brightness-[0.3] z-[-1]"
      />
      <div className="z-[1] w-full max-w-[1350px] mx-auto h-full lg:h-[270px] py-[24px] px-[5%] flex flex-row-reverse justify-between ">
        {/* links */}
        <div className="w-full lg:w-[30%] flex flex-row-reverse items-center justify-around lg:justify-between text-white text-right">
          {/* quick access */}
          <div>
            <h2 className="text-lg lg:text-xl font-normal lg:font-bold mb-3">
              دسترسی آسان
            </h2>

            <ul className="text-sm">
              <li className="mb-2 lg:mb-8 hover:footer-link-hover hover:text-Primary cursor-pointer lg:text-base ">
                پرسش‌های متداول
              </li>
              <li className="mb-2 lg:mb-8 hover:footer-link-hover hover:text-Primary cursor-pointer lg:text-base ">
                قوانین ترخینه
              </li>
              <li className="mb-2 lg:mb-8 hover:footer-link-hover hover:text-Primary cursor-pointer lg:text-base ">
                حریم خصوصی
              </li>
            </ul>
          </div>

          {/* agency */}
          <div>
            <h2 className="text-lg lg:text-xl font-normal lg:font-bold mb-3">
              شعبه‌های ترخینه
            </h2>
            <ul className="text-sm">
              <li className="mb-2 lg:mb-6 hover:footer-link-hover hover:text-Primary cursor-pointer lg:text-base ">
                شعبه اکباتان
              </li>
              <li className="mb-2 lg:mb-6 hover:footer-link-hover hover:text-Primary cursor-pointer lg:text-base ">
                شعبه چالوس
              </li>
              <li className="mb-2 lg:mb-6 hover:footer-link-hover hover:text-Primary cursor-pointer lg:text-base ">
                شعبه اقدسیه
              </li>
              <li className="mb-2 lg:mb-6 hover:footer-link-hover hover:text-Primary cursor-pointer lg:text-base ">
                شعبه ونک
              </li>
            </ul>
          </div>
        </div>

        {/* cta to us */}
        <FooterForm />
      </div>
    </div>
  );
}
