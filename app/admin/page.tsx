import { Building2, UtensilsCrossed, ShoppingCart, Users } from "lucide-react";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">پنل مدیریت</h1>
        <p className="text-gray-600">
          خوش آمدید! از منوی کناری بخش مورد نظر را انتخاب کنید
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کل شعبه‌ها</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کل غذاها</p>
              <p className="text-2xl font-bold text-gray-900">148</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">سفارشات امروز</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کل کاربران</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">فعالیت‌های اخیر</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                سفارش جدید از شعبه اکباتان دریافت شد
              </span>
              <span className="text-xs text-gray-400 mr-auto">2 دقیقه پیش</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                غذای جدید "کباب کوبیده" اضافه شد
              </span>
              <span className="text-xs text-gray-400 mr-auto">5 دقیقه پیش</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                کاربر جدید ثبت نام کرد
              </span>
              <span className="text-xs text-gray-400 mr-auto">
                10 دقیقه پیش
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
