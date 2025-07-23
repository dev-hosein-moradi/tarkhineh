"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";

// Dummy fetch function, replace with your API call
async function fetchBranches() {
  // Example: return await fetch("/api/branches").then(res => res.json());
  return [
    {
      id: "1",
      name: "Branch 1",
      title: "Main Branch",
      address: "123 Main St",
      ownerFullName: "Ali Rezaei",
      tel: ["02112345678"],
      createdAt: "2024-07-01",
    },
    // ...more branches
  ];
}

export default function BranchTable({
  onEdit,
  onDelete,
  onView,
}: {
  onEdit: (branch: any) => void;
  onDelete: (branch: any) => void;
  onView: (branch: any) => void;
}) {
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    fetchBranches().then(setBranches);
  }, []);

  return (
    <div dir="rtl" className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">نام شعبه</TableHead>
            <TableHead className="text-right">عنوان</TableHead>
            <TableHead className="text-right">مالک</TableHead>
            <TableHead className="text-right">تلفن</TableHead>
            <TableHead className="text-right">تاریخ ایجاد</TableHead>
            <TableHead className="text-right">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="text-right">{branch.name}</TableCell>
              <TableCell className="text-right">{branch.title}</TableCell>
              <TableCell className="text-right">
                {branch.ownerFullName}
              </TableCell>
              <TableCell className="text-right">
                {branch.tel?.join(", ")}
              </TableCell>
              <TableCell className="text-right">{branch.createdAt}</TableCell>
              <TableCell className="text-right flex gap-2 justify-center">
                <Button
                  className="bg-gray-100 text-black border-gray-200 border-2 hover:bg-gray-100"
                  size="icon"
                  onClick={() => onView(branch)}
                  title="مشاهده"
                >
                  <Eye />
                </Button>
                <Button
                  className="bg-gray-100 text-black border-gray-200 border-2 hover:bg-gray-100"
                  size="icon"
                  onClick={() => onEdit(branch)}
                  title="ویرایش"
                >
                  <Edit />
                </Button>
                <Button
                  className="bg-gray-100 text-black border-gray-200 border-2 hover:bg-gray-100"
                  size="icon"
                  onClick={() => onDelete(branch)}
                  title="حذف"
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
