// Form component for adding new todos

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus, Sparkles } from "lucide-react";
import { CreateTodoInput } from "@/types/todo";

interface AddToDoFormProps {
  onSubmit: (todo: CreateTodoInput) => Promise<void>;
  isLoading: boolean;
}

export const AddToDoForm = ({ onSubmit, isLoading }: AddToDoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    try {
      await onSubmit({ 
        title: title.trim(), 
        description: description.trim() || undefined 
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setIsExpanded(false);
    } catch (error) {
      // Error handling is done in parent component
      console.error('Failed to create todo:', error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value && !isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <Card className="todo-card border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              disabled={isLoading}
              className="border-primary/20 focus:border-primary focus:ring-primary/20 text-base"
              maxLength={100}
              autoComplete="off"
            />
            
            {isExpanded && (
              <div className="animate-slide-in">
                <Textarea
                  placeholder="Add a description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className="border-primary/20 focus:border-primary focus:ring-primary/20 resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={!title.trim() || isLoading}
              className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
            
            {isExpanded && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsExpanded(false);
                  setDescription("");
                }}
                disabled={isLoading}
                className="border-primary/20 text-muted-foreground hover:text-card-foreground"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};