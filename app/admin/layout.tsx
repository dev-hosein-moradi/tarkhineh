"use client";
import AdminSidebar from "./components/admin-sidebar";
import AdminBreadcrumb from "./components/admin-breadcrumb";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          "lg:mr-80", // Default margin for desktop sidebar
          "min-h-screen"
        )}
      >
        <AdminBreadcrumb />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
