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

// Category and Subcategory types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  status: 'active' | 'inactive';
  subcategories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Content types with enhanced categorization
export interface Question {
  id: string;
  question: string;
  answer: string;
  categoryId?: string;
  subcategoryId?: string;
  category?: Category;
  subcategory?: Subcategory;
  tags: string[];
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
  categoryId?: string;
  subcategoryId?: string;
  category?: Category;
  subcategory?: Subcategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQ {
  id: string;
  question: string;
  options: MCQOption[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId?: string;
  subcategoryId?: string;
  category?: Category;
  subcategory?: Subcategory;
  tags: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
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
  category?: Category;
  subcategory?: Subcategory;
  instructor: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
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

// Updated Quiz interface with proper MCQ references
export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  status: 'active' | 'inactive';
  categoryId?: string;
  subcategoryId?: string;
  category?: Category;
  subcategory?: Subcategory;
  tags: string[];
  questions: string[]; // Array of MCQ IDs
  questionsData?: MCQ[]; // Populated MCQ data
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

// Form types
export interface QuestionFormData {
  question: string;
  answer: string;
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  status: 'published' | 'draft';
}

export interface MCQFormData {
  question: string;
  options: MCQOption[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  status: 'active' | 'inactive';
}

export interface QuizFormData {
  title: string;
  description: string;
  timeLimit?: number;
  passingScore: number;
  status: 'active' | 'inactive';
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  questions: string[];
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

// Filter options
export interface FilterOptions {
  categories: Category[];
  subcategories: Subcategory[];
  tags: string[];
  difficulties?: string[];
  statuses?: string[];
}