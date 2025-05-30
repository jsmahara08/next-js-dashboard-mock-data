import { User, Question, News, MCQ, Category, Course, Quiz, CMSPage, SiteSettings } from '@/types';

// Mock data for Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User',
    createdAt: '2023-01-15T09:24:32Z',
    lastLogin: '2023-06-30T14:18:05Z',
  },
  {
    id: '2',
    name: 'John Editor',
    email: 'john@example.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=John+Editor',
    createdAt: '2023-02-12T11:45:23Z',
    lastLogin: '2023-06-28T08:33:12Z',
  },
  {
    id: '3',
    name: 'Alice Viewer',
    email: 'alice@example.com',
    role: 'viewer',
    status: 'inactive',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Viewer',
    createdAt: '2023-03-05T15:12:47Z',
    lastLogin: '2023-05-19T16:22:43Z',
  },
  {
    id: '4',
    name: 'Robert Admin',
    email: 'robert@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Robert+Admin',
    createdAt: '2023-01-25T09:24:32Z',
    lastLogin: '2023-06-29T11:42:18Z',
  },
  {
    id: '5',
    name: 'Emma Editor',
    email: 'emma@example.com',
    role: 'editor',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Editor',
    createdAt: '2023-02-18T14:37:09Z',
    lastLogin: '2023-06-25T09:15:47Z',
  },
];

// Mock data for Q&A
export const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'What is React?',
    answer: 'React is a JavaScript library for building user interfaces, particularly single-page applications.',
    category: 'Programming',
    status: 'published',
    createdAt: '2023-03-15T08:24:11Z',
    updatedAt: '2023-04-02T11:42:36Z',
    createdBy: '2',
  },
  {
    id: '2',
    question: 'How does Next.js differ from React?',
    answer: 'Next.js is a React framework that provides additional features such as server-side rendering, static site generation, and API routes.',
    category: 'Programming',
    status: 'published',
    createdAt: '2023-03-22T14:15:23Z',
    updatedAt: '2023-04-05T09:33:18Z',
    createdBy: '2',
  },
  {
    id: '3',
    question: 'What is TypeScript?',
    answer: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    category: 'Programming',
    status: 'draft',
    createdAt: '2023-04-10T10:08:45Z',
    updatedAt: '2023-04-10T10:08:45Z',
    createdBy: '5',
  },
  {
    id: '4',
    question: 'How to use hooks in React?',
    answer: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components. Examples include useState, useEffect, and useContext.',
    category: 'Programming',
    status: 'published',
    createdAt: '2023-04-12T16:42:21Z',
    updatedAt: '2023-04-20T11:37:55Z',
    createdBy: '2',
  },
  {
    id: '5',
    question: 'What is JWT authentication?',
    answer: 'JWT (JSON Web Token) authentication is a token-based stateless authentication mechanism. The client and server share these tokens for authentication instead of using cookies.',
    category: 'Security',
    status: 'published',
    createdAt: '2023-04-18T08:56:32Z',
    updatedAt: '2023-04-25T14:22:47Z',
    createdBy: '4',
  },
];

// Mock data for News
export const mockNews: News[] = [
  {
    id: '1',
    title: 'New Course Launch: Advanced React Patterns',
    content: '<p>We are excited to announce the launch of our new course, "Advanced React Patterns".</p><p>This course will cover advanced topics such as Render Props, Higher-Order Components, Custom Hooks, and more.</p>',
    excerpt: 'Explore advanced React patterns in our new course.',
    slug: 'new-course-launch-advanced-react-patterns',
    featuredImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    status: 'published',
    publishDate: '2023-06-15T09:00:00Z',
    createdAt: '2023-06-10T14:23:11Z',
    updatedAt: '2023-06-14T11:45:36Z',
    author: '2',
    tags: ['React', 'Course', 'Frontend'],
  },
  {
    id: '2',
    title: 'Upcoming Webinar: Introduction to TypeScript',
    content: '<p>Join us for a free webinar on TypeScript fundamentals.</p><p>Learn how TypeScript can improve your development workflow and catch errors before runtime.</p>',
    excerpt: 'Free webinar covering TypeScript basics and advanced features.',
    slug: 'upcoming-webinar-introduction-to-typescript',
    featuredImage: 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg',
    status: 'published',
    publishDate: '2023-06-20T15:00:00Z',
    createdAt: '2023-06-12T08:45:23Z',
    updatedAt: '2023-06-15T10:12:18Z',
    author: '5',
    tags: ['TypeScript', 'Webinar', 'Programming'],
  },
  {
    id: '3',
    title: 'Site Maintenance Scheduled',
    content: '<p>We will be performing scheduled maintenance on our platform.</p><p>The site will be unavailable from 2AM to 4AM EST on July 1st.</p>',
    excerpt: 'Platform will be down for maintenance on July 1st.',
    slug: 'site-maintenance-scheduled',
    status: 'draft',
    publishDate: '2023-06-28T09:00:00Z',
    createdAt: '2023-06-15T11:32:45Z',
    updatedAt: '2023-06-15T11:32:45Z',
    author: '1',
    tags: ['Maintenance', 'Announcement'],
  },
  {
    id: '4',
    title: 'New Feature: Quiz Management System',
    content: '<p>We are proud to announce our new Quiz Management System.</p><p>Create, manage, and track quizzes more efficiently with our new tools.</p>',
    excerpt: 'Introducing our new quiz creation and management tools.',
    slug: 'new-feature-quiz-management-system',
    featuredImage: 'https://images.pexels.com/photos/5428002/pexels-photo-5428002.jpeg',
    status: 'published',
    publishDate: '2023-06-22T12:00:00Z',
    createdAt: '2023-06-18T09:22:33Z',
    updatedAt: '2023-06-20T14:15:47Z',
    author: '4',
    tags: ['Feature', 'Quiz', 'Update'],
  },
  {
    id: '5',
    title: 'Partnership with Tech Academy',
    content: '<p>We are excited to announce our partnership with Tech Academy.</p><p>This collaboration will bring new courses and learning opportunities for our users.</p>',
    excerpt: 'New partnership to expand our course offerings.',
    slug: 'partnership-with-tech-academy',
    featuredImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    status: 'published',
    publishDate: '2023-06-25T10:00:00Z',
    createdAt: '2023-06-20T13:47:21Z',
    updatedAt: '2023-06-23T09:33:15Z',
    author: '1',
    tags: ['Partnership', 'Courses', 'Announcement'],
  },
];

// Mock data for MCQs
export const mockMCQs: MCQ[] = [
  {
    id: '1',
    question: 'Which of the following is NOT a JavaScript data type?',
    options: [
      { id: 'a', text: 'String', isCorrect: false },
      { id: 'b', text: 'Boolean', isCorrect: false },
      { id: 'c', text: 'Character', isCorrect: true },
      { id: 'd', text: 'Number', isCorrect: false },
    ],
    explanation: 'JavaScript does not have a "Character" data type. It uses strings for text data.',
    difficulty: 'easy',
    category: 'JavaScript',
    tags: ['JavaScript', 'Basics', 'Data Types'],
    status: 'active',
  },
  {
    id: '2',
    question: 'What does the "useEffect" hook do in React?',
    options: [
      { id: 'a', text: 'Manages state in functional components', isCorrect: false },
      { id: 'b', text: 'Performs side effects in functional components', isCorrect: true },
      { id: 'c', text: 'Creates custom hooks', isCorrect: false },
      { id: 'd', text: 'Optimizes rendering performance', isCorrect: false },
    ],
    explanation: 'The useEffect hook allows you to perform side effects in function components, such as data fetching, subscriptions, or manually changing the DOM.',
    difficulty: 'medium',
    category: 'React',
    tags: ['React', 'Hooks', 'useEffect'],
    status: 'active',
  },
  {
    id: '3',
    question: 'Which HTTP method is idempotent?',
    options: [
      { id: 'a', text: 'GET', isCorrect: true },
      { id: 'b', text: 'POST', isCorrect: false },
      { id: 'c', text: 'PATCH', isCorrect: false },
      { id: 'd', text: 'None of the above', isCorrect: false },
    ],
    explanation: 'GET, PUT, DELETE are idempotent methods, meaning multiple identical requests should have the same effect as a single request.',
    difficulty: 'hard',
    category: 'Web Development',
    tags: ['HTTP', 'REST', 'API'],
    status: 'active',
  },
  {
    id: '4',
    question: 'What is the purpose of the "key" prop in React lists?',
    options: [
      { id: 'a', text: 'It styles the list items', isCorrect: false },
      { id: 'b', text: 'It makes the list sortable', isCorrect: false },
      { id: 'c', text: 'It helps React identify which items have changed', isCorrect: true },
      { id: 'd', text: 'It specifies the list order', isCorrect: false },
    ],
    explanation: 'Keys help React identify which items have changed, been added, or been removed, which helps with efficient updates to the UI.',
    difficulty: 'medium',
    category: 'React',
    tags: ['React', 'Lists', 'Keys'],
    status: 'active',
  },
  {
    id: '5',
    question: 'What is the correct syntax for an arrow function in JavaScript?',
    options: [
      { id: 'a', text: 'function() => {}', isCorrect: false },
      { id: 'b', text: '() => {}', isCorrect: true },
      { id: 'c', text: '=> () {}', isCorrect: false },
      { id: 'd', text: 'function => () {}', isCorrect: false },
    ],
    explanation: 'The correct syntax for an arrow function is: (parameters) => { statements }',
    difficulty: 'easy',
    category: 'JavaScript',
    tags: ['JavaScript', 'Functions', 'Arrow Functions'],
    status: 'active',
  },
];

// Mock data for Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Courses related to web development technologies and frameworks.',
    status: 'active',
  },
  {
    id: '2',
    name: 'Frontend',
    slug: 'frontend',
    description: 'Frontend development technologies and frameworks.',
    parentId: '1',
    status: 'active',
  },
  {
    id: '3',
    name: 'Backend',
    slug: 'backend',
    description: 'Backend development technologies and frameworks.',
    parentId: '1',
    status: 'active',
  },
  {
    id: '4',
    name: 'Database',
    slug: 'database',
    description: 'Database technologies and management.',
    parentId: '1',
    status: 'active',
  },
  {
    id: '5',
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'Mobile app development for iOS and Android.',
    status: 'active',
  },
  {
    id: '6',
    name: 'iOS',
    slug: 'ios',
    description: 'iOS app development with Swift and SwiftUI.',
    parentId: '5',
    status: 'active',
  },
  {
    id: '7',
    name: 'Android',
    slug: 'android',
    description: 'Android app development with Kotlin and Java.',
    parentId: '5',
    status: 'active',
  },
  {
    id: '8',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Data science, machine learning, and AI.',
    status: 'active',
  },
  {
    id: '9',
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design principles and tools.',
    status: 'active',
  },
];

// Mock data for Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React, including components, props, state, and hooks.',
    slug: 'react-fundamentals',
    featuredImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
    price: 49.99,
    status: 'published',
    categoryId: '2',
    subcategoryId: undefined,
    instructor: 'John Doe',
    duration: 120,
    level: 'beginner',
    createdAt: '2023-02-15T10:24:32Z',
    updatedAt: '2023-05-10T14:18:05Z',
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to React',
        content: 'Overview of React and its core concepts.',
        duration: 15,
        order: 1,
        courseId: '1',
      },
      {
        id: '1-2',
        title: 'Components and Props',
        content: 'Creating and using React components with props.',
        duration: 25,
        order: 2,
        courseId: '1',
      },
    ],
  },
  {
    id: '2',
    title: 'Node.js API Development',
    description: 'Build RESTful APIs with Node.js, Express, and MongoDB.',
    slug: 'nodejs-api-development',
    featuredImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    price: 69.99,
    status: 'published',
    categoryId: '3',
    subcategoryId: undefined,
    instructor: 'Jane Smith',
    duration: 180,
    level: 'intermediate',
    createdAt: '2023-03-10T09:15:23Z',
    updatedAt: '2023-05-15T11:42:18Z',
    lessons: [
      {
        id: '2-1',
        title: 'Setting up a Node.js Project',
        content: 'Project initialization and structure.',
        duration: 20,
        order: 1,
        courseId: '2',
      },
      {
        id: '2-2',
        title: 'Express.js Basics',
        content: 'Creating routes and middleware with Express.',
        duration: 30,
        order: 2,
        courseId: '2',
      },
    ],
  },
  {
    id: '3',
    title: 'SQL Database Design',
    description: 'Learn how to design efficient and scalable SQL databases.',
    slug: 'sql-database-design',
    featuredImage: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg',
    price: 59.99,
    status: 'draft',
    categoryId: '4',
    subcategoryId: undefined,
    instructor: 'Mike Johnson',
    duration: 150,
    level: 'intermediate',
    createdAt: '2023-04-05T14:37:45Z',
    updatedAt: '2023-04-05T14:37:45Z',
    lessons: [
      {
        id: '3-1',
        title: 'Database Normalization',
        content: 'Understanding the principles of database normalization.',
        duration: 25,
        order: 1,
        courseId: '3',
      },
      {
        id: '3-2',
        title: 'Entity-Relationship Modeling',
        content: 'Creating ER diagrams and mapping them to tables.',
        duration: 35,
        order: 2,
        courseId: '3',
      },
    ],
  },
  {
    id: '4',
    title: 'iOS Development with Swift',
    description: 'Build iOS applications using Swift and SwiftUI.',
    slug: 'ios-development-swift',
    featuredImage: 'https://images.pexels.com/photos/7974/pexels-photo.jpg',
    price: 79.99,
    status: 'published',
    categoryId: '6',
    subcategoryId: undefined,
    instructor: 'Sarah Wilson',
    duration: 210,
    level: 'advanced',
    createdAt: '2023-04-20T11:22:33Z',
    updatedAt: '2023-05-25T09:15:47Z',
    lessons: [
      {
        id: '4-1',
        title: 'Swift Language Basics',
        content: 'Introduction to Swift syntax and features.',
        duration: 30,
        order: 1,
        courseId: '4',
      },
      {
        id: '4-2',
        title: 'Building UI with SwiftUI',
        content: 'Creating user interfaces with SwiftUI.',
        duration: 40,
        order: 2,
        courseId: '4',
      },
    ],
  },
  {
    id: '5',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning concepts and algorithms.',
    slug: 'machine-learning-fundamentals',
    featuredImage: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    price: 89.99,
    status: 'published',
    categoryId: '8',
    subcategoryId: undefined,
    instructor: 'Robert Brown',
    duration: 240,
    level: 'beginner',
    createdAt: '2023-05-01T13:47:21Z',
    updatedAt: '2023-06-02T10:33:15Z',
    lessons: [
      {
        id: '5-1',
        title: 'Introduction to ML',
        content: 'Overview of machine learning concepts and applications.',
        duration: 25,
        order: 1,
        courseId: '5',
      },
      {
        id: '5-2',
        title: 'Supervised Learning',
        content: 'Understanding supervised learning algorithms.',
        duration: 35,
        order: 2,
        courseId: '5',
      },
    ],
  },
];

// Mock data for Quizzes
export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'JavaScript Basics Quiz',
    description: 'Test your knowledge of JavaScript fundamentals.',
    timeLimit: 15,
    passingScore: 70,
    status: 'active',
    questions: [mockMCQs[0], mockMCQs[4]],
    createdAt: '2023-05-15T10:24:32Z',
    updatedAt: '2023-06-10T14:18:05Z',
  },
  {
    id: '2',
    title: 'React Concepts Quiz',
    description: 'Verify your understanding of React concepts and patterns.',
    timeLimit: 20,
    passingScore: 80,
    status: 'active',
    questions: [mockMCQs[1], mockMCQs[3]],
    createdAt: '2023-05-22T11:15:23Z',
    updatedAt: '2023-06-15T09:42:18Z',
  },
  {
    id: '3',
    title: 'Web Development Assessment',
    description: 'Comprehensive test covering various web development topics.',
    timeLimit: 30,
    passingScore: 75,
    status: 'inactive',
    questions: [mockMCQs[0], mockMCQs[1], mockMCQs[2], mockMCQs[3], mockMCQs[4]],
    createdAt: '2023-06-01T14:37:45Z',
    updatedAt: '2023-06-01T14:37:45Z',
  },
];

// Mock data for CMS Pages
export const mockCMSPages: CMSPage[] = [
  {
    id: '1',
    title: 'Home',
    slug: 'home',
    content: '<h1>Welcome to Our Learning Platform</h1><p>Discover courses on web development, mobile development, data science, and more.</p>',
    status: 'published',
    createdAt: '2023-03-15T10:24:32Z',
    updatedAt: '2023-06-10T14:18:05Z',
  },
  {
    id: '2',
    title: 'About Us',
    slug: 'about',
    content: '<h1>About Our Platform</h1><p>We are dedicated to providing high-quality online education in technology fields.</p>',
    status: 'published',
    createdAt: '2023-03-20T11:15:23Z',
    updatedAt: '2023-05-15T09:42:18Z',
  },
  {
    id: '3',
    title: 'Contact Us',
    slug: 'contact',
    content: '<h1>Contact Us</h1><p>Get in touch with our team for any inquiries or support.</p>',
    status: 'published',
    createdAt: '2023-03-25T14:37:45Z',
    updatedAt: '2023-04-10T11:33:19Z',
  },
  {
    id: '4',
    title: 'Terms of Service',
    slug: 'terms',
    content: '<h1>Terms of Service</h1><p>Please read our terms of service carefully before using our platform.</p>',
    status: 'published',
    createdAt: '2023-04-01T09:22:33Z',
    updatedAt: '2023-04-05T13:15:47Z',
  },
  {
    id: '5',
    title: 'Privacy Policy',
    slug: 'privacy',
    content: '<h1>Privacy Policy</h1><p>This policy outlines how we collect, use, and protect your data.</p>',
    status: 'published',
    createdAt: '2023-04-05T13:47:21Z',
    updatedAt: '2023-04-10T10:33:15Z',
  },
];

// Mock data for Site Settings
export const mockSiteSettings: SiteSettings = {
  siteName: 'Learning Platform',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  primaryColor: '#3B82F6',
  contactEmail: 'contact@example.com',
  socialLinks: {
    facebook: 'https://facebook.com/learningplatform',
    twitter: 'https://twitter.com/learningplatform',
    instagram: 'https://instagram.com/learningplatform',
    linkedin: 'https://linkedin.com/company/learningplatform',
  },
  footer: {
    copyright: '© 2023 Learning Platform. All rights reserved.',
    links: [
      { text: 'Terms', url: '/terms' },
      { text: 'Privacy', url: '/privacy' },
      { text: 'FAQ', url: '/faq' },
    ],
  },
};