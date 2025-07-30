"use client";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, ChevronLeft } from "lucide-react";

const AdminBreadcrumb = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    admin: "پنل مدیریت",
    branch: "شعبه‌ها",
    food: "غذاها",
    accompaniment: "اقلام جانبی",
    "accompaniment-category": "دسته‌بندی اقلام",
    users: "کاربران",
    orders: "سفارشات",
    reports: "گزارشات",
    blog: "بلاگ",
    settings: "تنظیمات",
    form: "فرم",
    create: "ایجاد",
    edit: "ویرایش",
  };

  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      {
        title: "پنل مدیریت",
        href: "/admin",
        isHome: true,
        isLast: pathSegments.length <= 1,
      },
    ];

    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const currentPath = "/" + pathSegments.slice(0, i + 1).join("/");
      const isLast = i === pathSegments.length - 1;

      let title = breadcrumbMap[segment] || segment;

      // Handle form pages with better logic
      if (segment === "form") {
        const hasId = searchParams.get("id");
        title = hasId ? "ویرایش" : "افزودن";
      }

      breadcrumbs.push({
        title,
        href: currentPath,
        isLast,
        isHome: false,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center gap-2" dir="rtl">
            {breadcrumbs.map((crumb, index) => (
              <div key={`${crumb.href}-${index}`} className="flex items-center">
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage className="flex items-center gap-2 text-gray-900 font-medium">
                      {crumb.isHome && <Home className="h-4 w-4" />}
                      {crumb.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={crumb.href}
                      className="flex items-center gap-2 text-gray-600 hover:text-main transition-colors"
                    >
                      {crumb.isHome && <Home className="h-4 w-4" />}
                      {crumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="mx-2">
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default AdminBreadcrumb;
