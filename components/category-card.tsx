import { ICategory } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { fakeBlurDataURL } from "@/lib/blurDataImage";

export default function CategoryCard({
  data,
  classname,
}: {
  data: ICategory;
  classname: string;
}) {
  return (
    <div
      className={`relative border-Primary border rounded h-[111px] lg:h-[160px] w-[162px] lg:w-[230px] mx-1 sm:mx-2 my-12 lg:my-20 hover:shadow-card-shadow transition ease-out duration-150`}
    >
      <Image
        className="object-cover absolute -top-14 left-[18px] lg:left-[11px] rounded-full lg:-top-24 w-[125px] lg:w-[208px] h-[122px] lg:h-[205px] mx-auto bg-gray-100 transition duration-200"
        alt={data.name}
        src={data.image}
        width={208}
        height={205}
        quality={100}
        loading="lazy"
        placeholder="blur"
        blurDataURL={fakeBlurDataURL}
      />
      <Button
        variant="default"
        className="absolute -bottom-4 mx-[20%] lg:mx-[16%] bg-main text-white w-[90px] lg:w-[155px] h-[32px] lg:h-[48px] rounded font-normal text-[14px] lg:text-[20px]"
      >
        {data.name}
      </Button>
    </div>
  );
}
