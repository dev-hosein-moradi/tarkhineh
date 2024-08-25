"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function NavBreadcrumb({ now }: { now: string }) {
  const pathname = usePathname();

  return (
    <div className="mx-w-[1350px] mx-auto px-[5%] py-2">
      <Breadcrumb>
        <BreadcrumbList className="flex-row-reverse">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">خانه</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbLink href={pathname}>{now}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
