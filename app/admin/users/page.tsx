"use client";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, UserCheck } from "lucide-react";
import StaffUserTable from "./components/staff-user-table";
import CustomerUserTable from "./components/customer-user-table";
import UserForm from "./components/user-form";
import { IUser } from "@/types";
import { canCreateUsers } from "@/services/user-service";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("staff");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const staffTableRef = useRef<any>(null);
  const customerTableRef = useRef<any>(null);

  // Handle successful form submission
  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingUser(null);

    // Refresh the appropriate table
    if (activeTab === "staff") {
      staffTableRef.current?.refreshTable();
    } else {
      customerTableRef.current?.refreshTable();
    }
  };

  // Handle create new user
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowCreateForm(true);
  };

  // Handle edit user
  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleDelete = (user: IUser) => {
    console.log("Delete user:", user);
    // TODO: Implement delete functionality
  };

  const handleView = (user: IUser) => {
    console.log("View user:", user);
    // TODO: Implement view functionality
  };

  const handleManagePermissions = (user: IUser) => {
    console.log("Manage permissions for:", user);
    // TODO: Implement permissions management
  };

  const handleResetPassword = (user: IUser) => {
    console.log("Reset password for:", user);
    // TODO: Implement password reset
  };

  const handleBanCustomer = (user: IUser) => {
    console.log("Ban customer:", user);
    // TODO: Implement customer ban/unban
  };

  // If showing form, render the form
  if (showCreateForm) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {editingUser ? "ویرایش کاربر" : "ایجاد کاربر جدید"}
            </h1>
            <p className="text-gray-600">
              {editingUser
                ? "اطلاعات کاربر را ویرایش کنید"
                : "اطلاعات کاربر جدید را وارد کنید"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setShowCreateForm(false);
              setEditingUser(null);
            }}
          >
            بازگشت
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <UserForm
              user={editingUser || undefined}
              onSuccess={handleFormSuccess}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main users page with tables
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
          <p className="text-gray-600">مدیریت کارکنان و مشتریان سیستم</p>
        </div>
        {canCreateUsers() && (
          <Button onClick={handleCreateUser} className="gap-2">
            <Plus className="w-4 h-4" />
            افزودن کاربر جدید
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff" className="gap-2">
            <UserCheck className="w-4 h-4" />
            کارکنان و مدیران
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-2">
            <Users className="w-4 h-4" />
            مشتریان
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-end gap-2">
                کارکنان و مدیران
                <UserCheck className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaffUserTable
                ref={staffTableRef}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onManagePermissions={handleManagePermissions}
                onResetPassword={handleResetPassword}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-end gap-2">
                مشتریان
                <Users className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerUserTable
                ref={customerTableRef}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onManagePermissions={handleManagePermissions}
                onResetPassword={handleResetPassword}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
