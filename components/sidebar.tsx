"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileQuestion,
  Newspaper,
  BookOpen,
  GraduationCap,
  Settings,
  Menu,
  FileEdit,
  LogOut,
  HelpCircle,
  List,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: {
    title: string;
    href: string;
  }[];
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: <List className="h-5 w-5" />,
    },
    {
      title: 'Q&A',
      href: '/admin/questions',
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      title: 'MCQs',
      href: '/admin/mcqs',
      icon: <FileQuestion className="h-5 w-5" />,
    },
    {
      title: 'Quizzes',
      href: '/admin/quizzes',
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: 'News',
      href: '/admin/news',
      icon: <Newspaper className="h-5 w-5" />,
    },
    {
      title: 'Courses',
      href: '/admin/courses',
      icon: <BookOpen className="h-5 w-5" />,
      submenu: [
        { title: 'All Courses', href: '/admin/courses' },
        { title: 'Categories', href: '/admin/courses/categories' },
      ],
    },
    {
      title: 'CMS Pages',
      href: '/admin/cms',
      icon: <FileEdit className="h-5 w-5" />,
      submenu: [
        { title: 'Home Page', href: '/admin/cms/home' },
        { title: 'About Page', href: '/admin/cms/about' },
        { title: 'Contact Page', href: '/admin/cms/contact' },
        { title: 'Header', href: '/admin/cms/header' },
        { title: 'Footer', href: '/admin/cms/footer' },
      ],
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const SidebarContent = () => (
    <div className={cn("flex h-screen flex-col border-r bg-card", collapsed ? "items-center" : "")}>
      <div className={cn("flex h-14 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-semibold">Admin Panel</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full justify-start gap-2 px-3",
                      collapsed ? "justify-center px-2" : "",
                      pathname.startsWith(item.href) ? "bg-accent" : "hover:bg-accent/50"
                    )}
                    onClick={() => toggleGroup(item.title)}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openGroups[item.title] ? "rotate-90" : ""
                          )}
                        />
                      </>
                    )}
                  </Button>
                  {!collapsed && openGroups[item.title] && (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                      {item.submenu.map((subitem) => (
                        <Button
                          key={subitem.href}
                          variant="ghost"
                          asChild
                          className={cn(
                            "justify-start pl-6",
                            pathname === subitem.href ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <Link href={subitem.href}>
                            {subitem.title}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "flex justify-start gap-2",
                    collapsed ? "justify-center px-2" : "",
                    pathname === item.href ? "bg-accent" : "hover:bg-accent/50"
                  )}
                >
                  <Link href={item.href}>
                    {item.icon}
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <SidebarContent />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}