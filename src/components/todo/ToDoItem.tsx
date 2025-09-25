// Individual todo item component with edit/delete functionality

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Calendar,
  Clock
} from "lucide-react";
import { Todo, UpdateTodoInput } from "@/types/todo";
import { cn } from "@/lib/utils";

interface ToDoItemProps {
  todo: Todo;
  onUpdate: (id: string, input: UpdateTodoInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  loadingOperation?: string;
}

export const ToDoItem = ({ 
  todo, 
  onUpdate, 
  onDelete, 
  isLoading,
  loadingOperation 
}: ToDoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");

  const isItemLoading = isLoading && loadingOperation === todo.id;

  const handleToggleComplete = async () => {
    if (isItemLoading) return;
    
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (isItemLoading) return;
    
    try {
      await onDelete(todo.id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card 
      className={cn(
        "todo-card transition-all duration-300 animate-fade-in",
        todo.completed && "todo-card-completed",
        isItemLoading && "opacity-60"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggleComplete}
              disabled={isItemLoading}
              className={cn(
                "h-5 w-5 rounded-md border-2 transition-all duration-200",
                todo.completed 
                  ? "border-success bg-success text-success-foreground animate-check" 
                  : "border-muted-foreground/30 hover:border-primary"
              )}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              /* Edit Mode */
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-medium text-base"
                  maxLength={100}
                  autoFocus
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description (optional)"
                  className="resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={!editTitle.trim() || isItemLoading}
                    className="bg-success hover:bg-success/90 text-success-foreground"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isItemLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-3">
                <h3 
                  className={cn(
                    "font-semibold text-lg leading-tight transition-all duration-200",
                    todo.completed 
                      ? "line-through text-muted-foreground" 
                      : "text-card-foreground"
                  )}
                >
                  {todo.title}
                </h3>
                
                {todo.description && (
                  <p 
                    className={cn(
                      "text-sm leading-relaxed transition-all duration-200",
                      todo.completed 
                        ? "line-through text-muted-foreground/70" 
                        : "text-muted-foreground"
                    )}
                  >
                    {todo.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created {formatDate(todo.createdAt)}
                  </div>
                  {todo.updatedAt !== todo.createdAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated {formatDate(todo.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex-shrink-0 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                disabled={isItemLoading}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-card-foreground hover:bg-secondary/50"
              >
                {isItemLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isItemLoading}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};