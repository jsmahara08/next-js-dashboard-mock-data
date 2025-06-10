"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/ui/tag-input";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Search, X } from 'lucide-react';
import { Category, MCQ } from '@/types';

export default function AddQuizPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [availableMCQs, setAvailableMCQs] = useState<MCQ[]>([]);
  const [filteredMCQs, setFilteredMCQs] = useState<MCQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    status: 'active' as 'active' | 'inactive',
    categoryId: '',
    subcategoryId: '',
    tags: [] as string[],
    questions: [] as string[]
  });

  useEffect(() => {
    fetchCategories();
    fetchMCQs();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
  }, [formData.categoryId]);

  useEffect(() => {
    filterMCQs();
  }, [availableMCQs, searchTerm, formData.categoryId, formData.subcategoryId]);

  const fetchCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      const mainCategories = data.filter((cat: Category) => !cat.parentId);
      setCategories(mainCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const data = await apiClient.getCategories();
      const subs = data.filter((cat: Category) => cat.parentId === categoryId);
      setSubcategories(subs);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchMCQs = async () => {
    try {
      const data = await apiClient.getMCQs();
      setAvailableMCQs(data.filter((mcq: MCQ) => mcq.status === 'active'));
    } catch (error) {
      console.error('Error fetching MCQs:', error);
    }
  };

  const filterMCQs = () => {
    let filtered = availableMCQs;

    if (searchTerm) {
      filtered = filtered.filter(mcq => 
        mcq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mcq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (formData.categoryId) {
      filtered = filtered.filter(mcq => mcq.categoryId === formData.categoryId);
    }

    if (formData.subcategoryId) {
      filtered = filtered.filter(mcq => mcq.subcategoryId === formData.subcategoryId);
    }

    setFilteredMCQs(filtered);
  };

  const toggleMCQ = (mcqId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.includes(mcqId)
        ? prev.questions.filter(id => id !== mcqId)
        : [...prev.questions, mcqId]
    }));
  };

  const removeSelectedMCQ = (mcqId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(id => id !== mcqId)
    }));
  };

  const getSelectedMCQs = () => {
    return availableMCQs.filter(mcq => formData.questions.includes(mcq.id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.questions.length === 0) {
      toast.error('Please select at least one question');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.createQuiz(formData);
      toast.success('Quiz created successfully');
      router.push('/admin/quizzes');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create quiz');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/quizzes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Quiz</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="1"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.passingScore}
                      onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 70 }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="subcategoryId">Subcategory</Label>
                    <Select 
                      value={formData.subcategoryId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subcategoryId: value }))}
                      disabled={!formData.categoryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Subcategories</SelectItem>
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <TagInput
                    value={formData.tags}
                    onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                    placeholder="Add tags (press Enter or comma to add)"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading || formData.questions.length === 0}>
                  {isLoading ? 'Creating...' : 'Create Quiz'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selected Questions ({formData.questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.questions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No questions selected</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getSelectedMCQs().map((mcq) => (
                    <div key={mcq.id} className="flex items-start gap-2 p-2 border rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{mcq.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {mcq.difficulty}
                          </Badge>
                          {mcq.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSelectedMCQ(mcq.id)}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Questions</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMCQs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No questions found</p>
                ) : (
                  filteredMCQs.map((mcq) => (
                    <div key={mcq.id} className="flex items-start gap-3 p-2 border rounded hover:bg-accent/50">
                      <Checkbox
                        checked={formData.questions.includes(mcq.id)}
                        onCheckedChange={() => toggleMCQ(mcq.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{mcq.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {mcq.difficulty}
                          </Badge>
                          {mcq.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}