// Main todo list component with filtering capabilities

import { Todo, TodoFilter } from "@/types/todo";
import { ToDoItem } from "./ToDoItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  List, 
  Trash2,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToDoListProps {
  todos: Todo[];
  onUpdate: (id: string, input: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  isLoading: boolean;
  loadingOperation?: string;
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

export const ToDoList = ({ 
  todos, 
  onUpdate, 
  onDelete, 
  onBulkDelete,
  isLoading,
  loadingOperation,
  filter,
  onFilterChange
}: ToDoListProps) => {
  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.ACTIVE:
        return !todo.completed;
      case TodoFilter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const filterButtons = [
    { 
      key: TodoFilter.ALL, 
      label: "All", 
      icon: List, 
      count: todos.length 
    },
    { 
      key: TodoFilter.ACTIVE, 
      label: "Active", 
      icon: Circle, 
      count: activeCount 
    },
    { 
      key: TodoFilter.COMPLETED, 
      label: "Completed", 
      icon: CheckCircle2, 
      count: completedCount 
    }
  ];

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
          <List className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-card-foreground mb-2">
          No tasks yet
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Start by adding your first task above. Stay organized and productive!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card/50 rounded-xl border border-border/50">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-card-foreground">Filter tasks:</span>
        </div>
        
        <div className="flex gap-2">
          {filterButtons.map(({ key, label, icon: Icon, count }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(key)}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                filter === key 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-secondary/80"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-1 text-xs px-1.5 py-0.5",
                  filter === key 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {completedCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDelete}
            disabled={isLoading}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Completed ({completedCount})
          </Button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No {filter === TodoFilter.ALL ? '' : filter.toLowerCase()} tasks found.
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <ToDoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isLoading={isLoading}
              loadingOperation={loadingOperation}
            />
          ))
        )}
      </div>

      {/* Summary */}
      {todos.length > 0 && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
            <span>Total: {todos.length}</span>
            <span>•</span>
            <span>Active: {activeCount}</span>
            <span>•</span>
            <span>Completed: {completedCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};