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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TagInput } from "@/components/ui/tag-input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { Category, MCQOption } from '@/types';

interface QuizMCQ {
  id: string;
  question: string;
  options: MCQOption[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export default function AddQuizPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [editingMCQIndex, setEditingMCQIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    status: 'active' as 'active' | 'inactive',
    courseId: '',
    categoryId: '',
    subcategoryId: '',
    tags: [] as string[],
    mcqs: [] as QuizMCQ[]
  });

  const [currentMCQ, setCurrentMCQ] = useState({
    question: '',
    options: [
      { id: 'a', text: '', isCorrect: false },
      { id: 'b', text: '', isCorrect: false },
      { id: 'c', text: '', isCorrect: false },
      { id: 'd', text: '', isCorrect: false },
    ] as MCQOption[],
    explanation: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: [] as string[]
  });

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubcategories(formData.categoryId);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
  }, [formData.categoryId]);

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

  const fetchCourses = async () => {
    try {
      const data = await apiClient.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const addMCQOption = () => {
    const newId = String.fromCharCode(97 + currentMCQ.options.length);
    setCurrentMCQ(prev => ({
      ...prev,
      options: [...prev.options, { id: newId, text: '', isCorrect: false }]
    }));
  };

  const removeMCQOption = (index: number) => {
    if (currentMCQ.options.length <= 2) {
      toast.error('At least 2 options are required');
      return;
    }
    setCurrentMCQ(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const updateMCQOption = (index: number, text: string) => {
    setCurrentMCQ(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, text } : option
      )
    }));
  };

  const setCorrectAnswer = (index: number) => {
    setCurrentMCQ(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        ({ ...option, isCorrect: i === index })
      )
    }));
  };

  const saveMCQ = () => {
    // Validation
    if (!currentMCQ.question.trim()) {
      toast.error('Question is required');
      return;
    }

    if (!currentMCQ.options.some(option => option.isCorrect)) {
      toast.error('Please select a correct answer');
      return;
    }

    if (currentMCQ.options.some(option => !option.text.trim())) {
      toast.error('All options must have text');
      return;
    }

    const mcqToSave = {
      ...currentMCQ,
      id: editingMCQIndex !== null ? formData.mcqs[editingMCQIndex].id : Date.now().toString()
    };

    if (editingMCQIndex !== null) {
      // Update existing MCQ
      setFormData(prev => ({
        ...prev,
        mcqs: prev.mcqs.map((mcq, index) => 
          index === editingMCQIndex ? mcqToSave : mcq
        )
      }));
      setEditingMCQIndex(null);
    } else {
      // Add new MCQ
      setFormData(prev => ({
        ...prev,
        mcqs: [...prev.mcqs, mcqToSave]
      }));
    }

    // Reset form
    setCurrentMCQ({
      question: '',
      options: [
        { id: 'a', text: '', isCorrect: false },
        { id: 'b', text: '', isCorrect: false },
        { id: 'c', text: '', isCorrect: false },
        { id: 'd', text: '', isCorrect: false },
      ],
      explanation: '',
      difficulty: 'medium',
      tags: []
    });

    setShowMCQModal(false);
    toast.success(editingMCQIndex !== null ? 'MCQ updated successfully' : 'MCQ added successfully');
  };

  const editMCQ = (index: number) => {
    const mcq = formData.mcqs[index];
    setCurrentMCQ({
      question: mcq.question,
      options: [...mcq.options],
      explanation: mcq.explanation,
      difficulty: mcq.difficulty,
      tags: [...mcq.tags]
    });
    setEditingMCQIndex(index);
    setShowMCQModal(true);
  };

  const removeMCQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mcqs: prev.mcqs.filter((_, i) => i !== index)
    }));
    toast.success('MCQ removed successfully');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.mcqs.length === 0) {
      toast.error('Please add at least one MCQ');
      return;
    }

    setIsLoading(true);

    try {
      // First create all MCQs
      const createdMCQs = [];
      for (const mcq of formData.mcqs) {
        const mcqData = {
          question: mcq.question,
          options: mcq.options,
          explanation: mcq.explanation,
          difficulty: mcq.difficulty,
          categoryId: formData.categoryId,
          subcategoryId: formData.subcategoryId,
          tags: mcq.tags,
          status: 'active'
        };
        const createdMCQ = await apiClient.createMCQ(mcqData);
        createdMCQs.push(createdMCQ.id);
      }

      // Then create the quiz with MCQ IDs
      const quizData = {
        title: formData.title,
        description: formData.description,
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        status: formData.status,
        courseId: formData.courseId,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        tags: formData.tags,
        questions: createdMCQs
      };

      await apiClient.createQuiz(quizData);
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quiz Information */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid gap-2">
                <Label htmlFor="courseId">Course</Label>
                <Select 
                  value={formData.courseId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Course</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <SelectItem value="">No Category</SelectItem>
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
                      <SelectItem value="">No Subcategory</SelectItem>
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
            </CardContent>
          </Card>

          {/* MCQ Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Quiz Questions ({formData.mcqs.length})
                <Dialog open={showMCQModal} onOpenChange={setShowMCQModal}>
                  <DialogTrigger asChild>
                    <Button type="button" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMCQIndex !== null ? 'Edit Question' : 'Add New Question'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="mcq-question">Question *</Label>
                        <Textarea
                          id="mcq-question"
                          value={currentMCQ.question}
                          onChange={(e) => setCurrentMCQ(prev => ({ ...prev, question: e.target.value }))}
                          rows={3}
                        />
                      </div>

                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <Label>Options *</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addMCQOption}
                            disabled={currentMCQ.options.length >= 6}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                        
                        <RadioGroup
                          value={currentMCQ.options.findIndex(opt => opt.isCorrect).toString()}
                          onValueChange={(value) => setCorrectAnswer(parseInt(value))}
                        >
                          {currentMCQ.options.map((option, index) => (
                            <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
                              <RadioGroupItem value={index.toString()} id={`mcq-option-${index}`} />
                              <Label htmlFor={`mcq-option-${index}`} className="text-sm font-medium">
                                {option.id.toUpperCase()}.
                              </Label>
                              <Input
                                value={option.text}
                                onChange={(e) => updateMCQOption(index, e.target.value)}
                                placeholder={`Option ${option.id.toUpperCase()}`}
                                className="flex-1"
                              />
                              {currentMCQ.options.length > 2 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeMCQOption(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                        <p className="text-sm text-muted-foreground">
                          Select the radio button next to the correct answer
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="mcq-explanation">Explanation</Label>
                        <Textarea
                          id="mcq-explanation"
                          value={currentMCQ.explanation}
                          onChange={(e) => setCurrentMCQ(prev => ({ ...prev, explanation: e.target.value }))}
                          rows={3}
                          placeholder="Explain why this is the correct answer..."
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="mcq-difficulty">Difficulty</Label>
                        <Select 
                          value={currentMCQ.difficulty} 
                          onValueChange={(value: 'easy' | 'medium' | 'hard') => setCurrentMCQ(prev => ({ ...prev, difficulty: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="mcq-tags">Tags</Label>
                        <TagInput
                          value={currentMCQ.tags}
                          onChange={(tags) => setCurrentMCQ(prev => ({ ...prev, tags }))}
                          placeholder="Add tags for this question"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowMCQModal(false);
                            setEditingMCQIndex(null);
                            setCurrentMCQ({
                              question: '',
                              options: [
                                { id: 'a', text: '', isCorrect: false },
                                { id: 'b', text: '', isCorrect: false },
                                { id: 'c', text: '', isCorrect: false },
                                { id: 'd', text: '', isCorrect: false },
                              ],
                              explanation: '',
                              difficulty: 'medium',
                              tags: []
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="button" onClick={saveMCQ}>
                          {editingMCQIndex !== null ? 'Update Question' : 'Add Question'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.mcqs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No questions added yet. Click "Add Question" to get started.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {formData.mcqs.map((mcq, index) => (
                    <div key={mcq.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-2 mb-2">{mcq.question}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {mcq.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {mcq.options.length} options
                            </Badge>
                            {mcq.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {mcq.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{mcq.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Correct: {mcq.options.find(opt => opt.isCorrect)?.text}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => editMCQ(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMCQ(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || formData.mcqs.length === 0}>
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
    </div>
  );
}