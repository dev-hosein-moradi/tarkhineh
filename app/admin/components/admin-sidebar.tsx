"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Building2,
  UtensilsCrossed,
  Coffee,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  FileText,
  Tags,
  Menu,
  X,
  ChevronLeft,
  Home,
  LogOut,
} from "lucide-react";
import { canAccessUsersSection } from "@/services/user-service";
// Add this import for auth context
import { useAuth } from "@/contexts/auth-context";

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [canAccessUsers, setCanAccessUsers] = useState(false);

  // Add auth context
  const { logout } = useAuth();

  // Check user access permissions
  useEffect(() => {
    setCanAccessUsers(canAccessUsersSection());
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsDesktopOpen(false);
      } else {
        setIsDesktopOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add logout handler
  const handleLogout = async () => {
    try {
      await logout();
      // The auth context will handle redirect to home page
      // But we can also explicitly redirect if needed
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to home
      router.push("/");
    }
  };

  // Define all navigation items
  const allNavItems = [
    {
      title: "داشبورد",
      path: "/admin",
      icon: Home,
      description: "صفحه اصلی مدیریت",
      show: true, // Always show dashboard
    },
    {
      title: "شعبه‌ها",
      path: "/admin/branch",
      icon: Building2,
      description: "مدیریت شعبه‌ها",
      show: true, // Assuming all admin roles can see branches
    },
    {
      title: "غذاها",
      path: "/admin/food",
      icon: UtensilsCrossed,
      description: "مدیریت منوی غذا",
      show: true, // Assuming all admin roles can see foods
    },
    {
      title: "اقلام جانبی",
      path: "/admin/accompaniment",
      icon: Coffee,
      description: "نوشیدنی، سالاد و...",
      show: true, // Assuming all admin roles can see accompaniments
    },
    {
      title: "دسته‌بندی اقلام",
      path: "/admin/accompaniment-category",
      icon: Tags,
      description: "دسته‌بندی اقلام جانبی",
      show: true, // Assuming all admin roles can see categories
    },
    {
      title: "کاربران",
      path: "/admin/users",
      icon: Users,
      description: "مدیریت کاربران",
      show: canAccessUsers, // Only show if user has access
    },
    {
      title: "سفارشات",
      path: "/admin/orders",
      icon: ShoppingCart,
      description: "مدیریت سفارشات",
      show: true, // Assuming all admin roles can see orders
    },
    {
      title: "گزارشات",
      path: "/admin/reports",
      icon: BarChart3,
      description: "آمار و گزارشات",
      show: true, // Assuming all admin roles can see reports
    },
    {
      title: "بلاگ",
      path: "/admin/blog",
      icon: FileText,
      description: "مدیریت مقالات",
      show: true, // Assuming all admin roles can see blog
    },
    {
      title: "تنظیمات",
      path: "/admin/settings",
      icon: Settings,
      description: "تنظیمات سیستم",
      show: true, // Assuming all admin roles can see settings
    },
  ];

  // Filter navigation items based on permissions
  const navItems = allNavItems.filter((item) => item.show);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }

    // Split pathname into segments for exact matching
    const pathSegments = pathname.split("/").filter(Boolean);
    const targetSegments = path.split("/").filter(Boolean);

    // Must have at least the same number of segments as target
    if (pathSegments.length < targetSegments.length) {
      return false;
    }

    // Check if all target segments match
    return targetSegments.every(
      (segment, index) => pathSegments[index] === segment
    );
  };

  const toggleMobile = () => {
    setIsOpen(!isOpen);
  };

  const toggleDesktop = () => {
    setIsDesktopOpen(!isDesktopOpen);
  };

  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-main text-white">
        <div className="flex flex-row-reverse justify-between pr-12 items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-main font-bold text-lg">ت</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">ترخینه</h2>
            <p className="text-sm opacity-90">پنل مدیریت</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={item.path}
                variant={active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 text-right",
                  active
                    ? "bg-main text-white hover:bg-main/90"
                    : "hover:bg-gray-100 text-gray-700"
                )}
                onClick={() => handleNavigation(item.path)}
                title={item.description}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1 text-right">{item.title}</span>
                {active && <ChevronLeft className="h-4 w-4" />}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer - Updated with logout handler */}
      <div className="p-6 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-right text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="flex-1 text-right">خروج</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-10 right-0 z-50 bg-white shadow-md"
        onClick={toggleMobile}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Desktop toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex fixed top-2 right-2 z-50 bg-white shadow-md"
        onClick={toggleDesktop}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex fixed top-0 right-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40",
          isDesktopOpen ? "translate-x-0 w-80" : "translate-x-72 w-8"
        )}
      >
        {isDesktopOpen && <SidebarContent />}
      </div>

      {/* Desktop Sidebar collapsed state */}
      {!isDesktopOpen && (
        <div className="hidden lg:block fixed top-0 right-0 h-full w-8 bg-main z-40" />
      )}
    </>
  );
};

export default AdminSidebar;
