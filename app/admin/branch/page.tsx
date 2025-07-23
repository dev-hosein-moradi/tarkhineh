"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import BranchTable from "./components/branch-table";
import BranchForm from "./components/branch-form";
import { AlertModal } from "@/components/modals/alert-modal";

type Branch = {
  name: string;
  title: string;
  ownerFullName: string;
  tel?: string[];
  address: string;
  // Add other fields as needed
};

export default function BranchPage() {
  const [open, setOpen] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [viewBranch, setViewBranch] = useState<Branch | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteBranch, setDeleteBranch] = useState<Branch | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Dummy delete function
  const handleDeleteConfirm = () => {
    // TODO: Call API to delete branch
    // Refresh table after delete
    setDeleteOpen(false);
    setDeleteBranch(null);
    // You can show a toast here if needed
  };

  return (
    <div className="flex flex-col items-center justify-between py-[16px] px-[5%] relative max-w-[1350px] mx-auto">
      <div className="w-full flex flex-row-reverse justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">شعبه ها</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-main" onClick={() => setEditBranch(null)}>
              افزودن شعبه
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="ml-auto">شعبه</DialogTitle>
            <BranchForm branch={editBranch} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <BranchTable
        onEdit={(branch) => {
          setEditBranch(branch);
          setOpen(true);
        }}
        onDelete={(branch) => {
          setDeleteBranch(branch);
          setDeleteOpen(true);
        }}
        onView={(branch) => {
          setViewBranch(branch);
          setViewOpen(true);
        }}
      />
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogTitle>مشاهده شعبه</DialogTitle>
          {viewBranch && (
            <div>
              <h2 className="text-xl font-bold mb-2">{viewBranch.name}</h2>
              <p>عنوان: {viewBranch.title}</p>
              <p>مالک: {viewBranch.ownerFullName}</p>
              <p>تلفن: {viewBranch.tel?.join(", ")}</p>
              <p>آدرس: {viewBranch.address}</p>
              {/* Add more fields as needed */}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={false}
      />
    </div>
  );
}
