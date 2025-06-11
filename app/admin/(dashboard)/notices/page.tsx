"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notice {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'published' | 'draft' | 'archived';
  publishDate: string;
  expiryDate?: string;
  author: {
    name: string;
    email: string;
  };
  categoryId?: {
    name: string;
    slug: string;
  };
  tags: string[];
  isSticky: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const columns: ColumnDef<Notice>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const notice = row.original;
      return (
        <div className="max-w-md">
          <p className="line-clamp-1 font-medium">{notice.title}</p>
          {notice.isSticky && (
            <Badge variant="secondary" className="text-xs mt-1">
              Sticky
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const colorMap = {
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      };
      return (
        <Badge className={colorMap[type as keyof typeof colorMap]}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const colorMap = {
        low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      };
      return (
        <Badge className={colorMap[priority as keyof typeof colorMap]}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colorMap = {
        published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      };
      return (
        <Badge className={colorMap[status as keyof typeof colorMap]}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as Notice["author"];
      return author?.name || "Unknown";
    },
  },
  {
    accessorKey: "viewCount",
    header: "Views",
  },
  {
    accessorKey: "publishDate",
    header: "Published",
    cell: ({ row }) => {
      const date = row.getValue("publishDate") as string;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const notice = row.original;

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this notice?")) return;

        try {
          await apiClient.delete(`/notices/${notice._id}`);
          toast.success("Notice deleted successfully");
          window.location.reload();
        } catch (error: any) {
          toast.error(error.message || "Failed to delete notice");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(notice._id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/notices/${notice._id}`}>Edit notice</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete notice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/notices');
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
        <Button asChild>
          <Link href="/admin/notices/add">
            <Plus className="mr-2 h-4 w-4" /> Add Notice
          </Link>
        </Button>
      </div>
      <div className="rounded-md border bg-card">
        <DataTable 
          columns={columns} 
          data={notices} 
          searchColumn="title" 
          searchPlaceholder="Search notices..." 
        />
      </div>
    </div>
  );
}