"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "@/components/rich-text-editor/tiptap-editor";
import { Switch } from "@/components/ui/switch";
import { News } from "@/types";
import { Loader2, Save, Eye, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await apiClient.getNewsArticle(params.id);
        setNews(data);
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt);
        setSlug(data.slug);
        setIsPublished(data.status === "published");
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch news article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [params.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.updateNews(params.id, {
        title,
        content,
        excerpt,
        slug,
        status: isPublished ? "published" : "draft",
      });

      toast.success("News article updated successfully");
      router.push("/admin/news");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update news article");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await apiClient.deleteNews(params.id);
      toast.success("News article deleted successfully");
      router.push("/admin/news");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete news article");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!news) {
    return <div>News article not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/news")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit News Article</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
              <CardDescription>Write your article content here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <TiptapEditor content={content} onChange={setContent} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief excerpt"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>Manage your article settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-friendly-slug"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Article
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Article Info</CardTitle>
              <CardDescription>Additional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Created:</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(news.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Last Updated:</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(news.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Author:</span>
                <p className="text-sm text-muted-foreground">{news.author}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Status:</span>
                <p className="text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      news.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {news.status}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}