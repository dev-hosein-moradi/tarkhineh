"use client";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import BranchTable from "./components/branch-table";
import BranchForm from "./components/branch-form"; // You'll need to create this
import { IBranch } from "@/types";
import { canCreateBranches } from "@/services/branch-service";

export default function BranchesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<IBranch | null>(null);
  const branchTableRef = useRef<any>(null);

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingBranch(null);
    branchTableRef.current?.refreshTable();
  };

  const handleCreateBranch = () => {
    setEditingBranch(null);
    setShowCreateForm(true);
  };

  const handleEdit = (branch: IBranch) => {
    setEditingBranch(branch);
    setShowCreateForm(true);
  };

  const handleDelete = (branch: IBranch) => {
    // TODO: Implement delete functionality with confirmation dialog
    console.log("Delete branch:", branch);
  };

  const handleView = (branch: IBranch) => {
    // TODO: Implement view functionality
    console.log("View branch:", branch);
  };

  // If showing form, render the form
  if (showCreateForm) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {editingBranch ? "ویرایش شعبه" : "ایجاد شعبه جدید"}
            </h1>
            <p className="text-gray-600">
              {editingBranch
                ? "اطلاعات شعبه را ویرایش کنید"
                : "اطلاعات شعبه جدید را وارد کنید"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setShowCreateForm(false);
              setEditingBranch(null);
            }}
          >
            بازگشت
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <BranchForm
              branch={editingBranch}
              onSuccess={handleFormSuccess}
              isEditing={!!editingBranch}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main branches page
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">مدیریت شعبه‌ها</h1>
          <p className="text-gray-600">مدیریت شعبه‌های رستوران ترخینه</p>
        </div>
        {canCreateBranches() && (
          <Button onClick={handleCreateBranch} className="gap-2">
            <Plus className="w-4 h-4" />
            افزودن شعبه جدید
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            شعبه‌های رستوران
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BranchTable
            ref={branchTableRef}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </CardContent>
      </Card>
    </div>
  );
}
