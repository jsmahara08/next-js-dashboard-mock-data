"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockNews } from "@/lib/mock-data";
import Link from "next/link";

export default function NewsPage() {
  const [news] = useState(mockNews);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">News Articles</h1>
        <Button asChild>
          <Link href="/admin/news/add">
            <Plus className="mr-2 h-4 w-4" /> Add Article
          </Link>
        </Button>
      </div>
      <div className="rounded-md border bg-card">
        <DataTable columns={columns} data={news} searchColumn="title" searchPlaceholder="Search articles..." />
      </div>
    </div>
  );
}