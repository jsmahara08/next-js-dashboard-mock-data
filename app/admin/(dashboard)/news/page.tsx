"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getNews();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading news...</p>
        </div>
      </div>
    );
  }

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