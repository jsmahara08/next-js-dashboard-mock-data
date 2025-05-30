// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

// Content types
export interface Question {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  status: 'published' | 'draft';
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
}

export interface MCQ {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  status: 'active' | 'inactive';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  featuredImage?: string;
  price: number;
  status: 'published' | 'draft';
  categoryId: string;
  subcategoryId?: string;
  instructor: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  order: number;
  courseId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  status: 'active' | 'inactive';
  questions: MCQ[];
  createdAt: string;
  updatedAt: string;
}

// CMS Page types
export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// Site settings
export interface SiteSettings {
  siteName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  footer: {
    copyright: string;
    links: {
      text: string;
      url: string;
    }[];
  };
}

// Table types for UI
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface FilterState {
  id: string;
  value: string;
}