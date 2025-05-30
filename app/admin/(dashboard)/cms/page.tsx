"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCMSPages } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { FileEdit, Layers, Globe, Plus } from "lucide-react";
import Link from "next/link";

export default function CMSPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">CMS Pages</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Page
        </Button>
      </div>
      
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">
            <Layers className="mr-2 h-4 w-4" /> Pages
          </TabsTrigger>
          <TabsTrigger value="components">
            <FileEdit className="mr-2 h-4 w-4" /> Components
          </TabsTrigger>
          <TabsTrigger value="navigation">
            <Globe className="mr-2 h-4 w-4" /> Navigation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCMSPages.map((page) => (
              <Card key={page.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="truncate">{page.title}</CardTitle>
                  <CardDescription className="flex justify-between items-center">
                    <span>/{page.slug}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {page.status}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex border-t">
                    <Button asChild variant="ghost" className="flex-1 rounded-none h-12">
                      <Link href={`/admin/cms/${page.slug}`}>
                        <FileEdit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="flex-1 rounded-none h-12 border-l">
                      <Link href={`/preview/${page.slug}`} target="_blank">
                        <Globe className="mr-2 h-4 w-4" /> Preview
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add new page card */}
            <Card className="border-dashed overflow-hidden">
              <div className="flex items-center justify-center h-full p-6">
                <Button variant="ghost" className="flex flex-col h-auto py-8">
                  <Plus className="h-8 w-8 mb-2" />
                  <span>Add New Page</span>
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="components" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
                <CardDescription>Main site navigation</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex border-t">
                  <Button asChild variant="ghost" className="flex-1 rounded-none h-12">
                    <Link href="/admin/cms/header">
                      <FileEdit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
                <CardDescription>Site footer with links</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex border-t">
                  <Button asChild variant="ghost" className="flex-1 rounded-none h-12">
                    <Link href="/admin/cms/footer">
                      <FileEdit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Homepage hero banner</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex border-t">
                  <Button asChild variant="ghost" className="flex-1 rounded-none h-12">
                    <Link href="/admin/cms/hero">
                      <FileEdit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="navigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menus</CardTitle>
              <CardDescription>
                Manage site navigation structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section will allow you to manage your site's navigation menus.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}