"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { News } from "@/types";
import Link from "next/link";
import { format } from "date-fns";

export const columns: ColumnDef<News>[] = [
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
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "published"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "publishDate",
    header: "Publish Date",
    cell: ({ row }) => {
      const date = row.getValue("publishDate") as string;
      return format(new Date(date), "MMM d, yyyy");
    },
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const news = row.original;

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
              onClick={() => navigator.clipboard.writeText(news.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/news/${news.id}`}>Edit article</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/news/${news.slug}`} target="_blank">
                View article
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];