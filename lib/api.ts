import { useAuth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Categories
  async getCategories() {
    return this.get('/categories');
  }

  async getCategory(id: string) {
    return this.get(`/categories/${id}`);
  }

  async createCategory(categoryData: any) {
    return this.post('/categories', categoryData);
  }

  async updateCategory(id: string, categoryData: any) {
    return this.put(`/categories/${id}`, categoryData);
  }

  async deleteCategory(id: string) {
    return this.delete(`/categories/${id}`);
  }

  // Users
  async getUsers() {
    return this.get('/users');
  }

  async getUser(id: string) {
    return this.get(`/users/${id}`);
  }

  async createUser(userData: any) {
    return this.post('/users', userData);
  }

  async updateUser(id: string, userData: any) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id: string) {
    return this.delete(`/users/${id}`);
  }

  // Questions
  async getQuestions() {
    return this.get('/questions');
  }

  async getQuestion(id: string) {
    return this.get(`/questions/${id}`);
  }

  async createQuestion(questionData: any) {
    return this.post('/questions', questionData);
  }

  async updateQuestion(id: string, questionData: any) {
    return this.put(`/questions/${id}`, questionData);
  }

  async deleteQuestion(id: string) {
    return this.delete(`/questions/${id}`);
  }

  // News
  async getNews() {
    return this.get('/news');
  }

  async getNewsArticle(id: string) {
    return this.get(`/news/${id}`);
  }

  async createNews(newsData: any) {
    return this.post('/news', newsData);
  }

  async updateNews(id: string, newsData: any) {
    return this.put(`/news/${id}`, newsData);
  }

  async deleteNews(id: string) {
    return this.delete(`/news/${id}`);
  }

  // MCQs
  async getMCQs() {
    return this.get('/mcqs');
  }

  async getMCQ(id: string) {
    return this.get(`/mcqs/${id}`);
  }

  async createMCQ(mcqData: any) {
    return this.post('/mcqs', mcqData);
  }

  async updateMCQ(id: string, mcqData: any) {
    return this.put(`/mcqs/${id}`, mcqData);
  }

  async deleteMCQ(id: string) {
    return this.delete(`/mcqs/${id}`);
  }

  // Courses
  async getCourses() {
    return this.get('/courses');
  }

  async getCourse(id: string) {
    return this.get(`/courses/${id}`);
  }

  async createCourse(courseData: any) {
    return this.post('/courses', courseData);
  }

  async updateCourse(id: string, courseData: any) {
    return this.put(`/courses/${id}`, courseData);
  }

  async deleteCourse(id: string) {
    return this.delete(`/courses/${id}`);
  }

  // Quizzes
  async getQuizzes() {
    return this.get('/quizzes');
  }

  async getQuiz(id: string) {
    return this.get(`/quizzes/${id}`);
  }

  async createQuiz(quizData: any) {
    return this.post('/quizzes', quizData);
  }

  async updateQuiz(id: string, quizData: any) {
    return this.put(`/quizzes/${id}`, quizData);
  }

  async deleteQuiz(id: string) {
    return this.delete(`/quizzes/${id}`);
  }

  // Notices
  async getNotices() {
    return this.get('/notices');
  }

  async getNotice(id: string) {
    return this.get(`/notices/${id}`);
  }

  async createNotice(noticeData: any) {
    return this.post('/notices', noticeData);
  }

  async updateNotice(id: string, noticeData: any) {
    return this.put(`/notices/${id}`, noticeData);
  }

  async deleteNotice(id: string) {
    return this.delete(`/notices/${id}`);
  }

  // CMS Pages
  async getCMSPages() {
    return this.get('/cms');
  }

  async getCMSPage(id: string) {
    return this.get(`/cms/${id}`);
  }

  async createCMSPage(pageData: any) {
    return this.post('/cms', pageData);
  }

  async updateCMSPage(id: string, pageData: any) {
    return this.put(`/cms/${id}`, pageData);
  }

  async deleteCMSPage(id: string) {
    return this.delete(`/cms/${id}`);
  }

  // Site Settings
  async getSiteSettings() {
    return this.get('/settings');
  }

  async updateSiteSettings(settingsData: any) {
    return this.put('/settings', settingsData);
  }
}

export const apiClient = new ApiClient();
export default apiClient;