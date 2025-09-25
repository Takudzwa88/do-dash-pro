// Modern To-Do Application - Portfolio Quality

import { useState, useEffect } from "react";
import { AddToDoForm } from "@/components/todo/AddToDoForm";
import { ToDoList } from "@/components/todo/ToDoList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { todoApi, ApiError } from "@/services/todoApi";
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter, LoadingState } from "@/types/todo";
import { CheckSquare, Sparkles } from "lucide-react";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.ALL);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsInitialLoading(true);
        const response = await todoApi.getAllTodos();
        setTodos(response.data);
      } catch (error) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : 'Failed to load tasks. Please refresh the page.';
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchTodos();
  }, [toast]);

  // Create new todo
  const handleCreateTodo = async (input: CreateTodoInput) => {
    setLoadingState({ isLoading: true, operation: 'create' });
    
    try {
      const response = await todoApi.createTodo(input);
      setTodos(prev => [response.data, ...prev]);
      
      toast({
        title: "Success",
        description: "Task created successfully!",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to create task. Please try again.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error; // Re-throw to prevent form reset
    } finally {
      setLoadingState({ isLoading: false });
    }
  };

  // Update todo
  const handleUpdateTodo = async (id: string, input: UpdateTodoInput) => {
    setLoadingState({ isLoading: true, operation: 'update', targetId: id });
    
    try {
      const response = await todoApi.updateTodo(id, input);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? response.data : todo
      ));

      // Show success message only for manual edits (not checkbox toggles)
      if (input.title || input.description) {
        toast({
          title: "Success",
          description: "Task updated successfully!",
          variant: "default",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to update task. Please try again.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoadingState({ isLoading: false });
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    setLoadingState({ isLoading: true, operation: 'delete', targetId: id });
    
    try {
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      
      toast({
        title: "Success",
        description: "Task deleted successfully!",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to delete task. Please try again.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  };

  // Bulk delete completed todos
  const handleBulkDelete = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    setLoadingState({ isLoading: true, operation: 'delete' });
    
    try {
      // Delete all completed todos
      await Promise.all(completedTodos.map(todo => todoApi.deleteTodo(todo.id)));
      setTodos(prev => prev.filter(todo => !todo.completed));
      
      toast({
        title: "Success",
        description: `${completedTodos.length} completed task(s) deleted!`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete completed tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
            <LoadingSpinner size="lg" className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-card-foreground">Loading your tasks...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Modern To-Do
              </h1>
              <p className="text-sm text-muted-foreground">
                Stay organized and productive
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Add Todo Form */}
          <AddToDoForm 
            onSubmit={handleCreateTodo}
            isLoading={loadingState.isLoading && loadingState.operation === 'create'}
          />

          {/* Todo List */}
          <ToDoList
            todos={todos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            onBulkDelete={handleBulkDelete}
            isLoading={loadingState.isLoading}
            loadingOperation={loadingState.targetId}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">
                Built with React, TypeScript & Tailwind CSS
              </span>
            </div>
            <p className="text-xs text-muted-foreground/70">
              Modern To-Do Application - Portfolio Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
