"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <div className="rounded-md border bg-card">
        <DataTable columns={columns} data={users} searchColumn="name" searchPlaceholder="Search users..." />
      </div>
    </div>
  );
}