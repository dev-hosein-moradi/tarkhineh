"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserTable from "./components/user-table";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteUser } from "@/services/user-service";
import { toast } from "sonner";
import { IUser } from "@/types";

// Define the ref type
interface UserTableRef {
  refreshTable: () => void;
}

export default function UsersPage() {
  const router = useRouter();
  const [deleteUserData, setDeleteUserData] = useState<IUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const tableRef = useRef<UserTableRef>(null);

  const handleDeleteConfirm = () => {
    if (!deleteUserData?.id) return;

    setDeleteLoading(true);
    deleteUser(deleteUserData.id)
      .then(() => {
        toast.success("کاربر با موفقیت حذف شد");
        setDeleteOpen(false);
        setDeleteUserData(null);
        tableRef.current?.refreshTable();
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("خطا در حذف کاربر");
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const handleAddUser = () => {
    router.push("/admin/users/form");
  };

  const handleEditUser = (user: IUser) => {
    router.push(`/admin/users/form?id=${user.id}`);
  };

  const handleManagePermissions = (user: IUser) => {
    router.push(`/admin/users/${user.id}/permissions`);
  };

  const handleResetPassword = (user: IUser) => {
    router.push(`/admin/users/${user.id}/password`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
        <Button className="bg-main" onClick={handleAddUser}>
          افزودن کاربر جدید
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <UserTable
          ref={tableRef}
          onEdit={handleEditUser}
          onDelete={(user) => {
            setDeleteUserData(user);
            setDeleteOpen(true);
          }}
          onView={(user) => {
            console.log("View user:", user);
            toast.info(`مشاهده کاربر: ${user.firstName} ${user.lastName}`);
          }}
          onManagePermissions={handleManagePermissions}
          onResetPassword={handleResetPassword}
        />
      </div>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteUserData(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
