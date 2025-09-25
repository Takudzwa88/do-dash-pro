// Mock API service for To-Do operations with simulated network latency

import { Todo, CreateTodoInput, UpdateTodoInput, ApiResponse, ApiError as ApiErrorType } from '@/types/todo';

// Mock data storage
let mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive README and code comments for the portfolio project',
    completed: false,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '2', 
    title: 'Review TypeScript best practices',
    description: 'Study advanced TypeScript patterns for better code organization',
    completed: true,
    createdAt: new Date('2024-01-14T14:30:00Z'),
    updatedAt: new Date('2024-01-15T09:15:00Z')
  },
  {
    id: '3',
    title: 'Design system implementation',
    description: 'Create consistent UI components with Tailwind CSS',
    completed: false,
    createdAt: new Date('2024-01-16T08:45:00Z'),
    updatedAt: new Date('2024-01-16T08:45:00Z')
  }
];

// Simulate network latency
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random API failures (10% chance)
const shouldSimulateError = () => Math.random() < 0.1;

class TodoApiService {
  // GET /todos - Fetch all todos
  async getAllTodos(): Promise<ApiResponse<Todo[]>> {
    await delay();
    
    if (shouldSimulateError()) {
      throw new ApiError({
        message: 'Failed to fetch todos. Please check your connection.',
        code: 'FETCH_ERROR'
      });
    }

    return {
      data: [...mockTodos].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      message: 'Todos fetched successfully',
      success: true
    };
  }

  // POST /todos - Create a new todo
  async createTodo(input: CreateTodoInput): Promise<ApiResponse<Todo>> {
    await delay();

    if (shouldSimulateError()) {
      throw new ApiError({
        message: 'Failed to create todo. Please try again.',
        code: 'CREATE_ERROR'
      });
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: input.title.trim(),
      description: input.description?.trim() || '',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockTodos.push(newTodo);

    return {
      data: newTodo,
      message: 'Todo created successfully',
      success: true
    };
  }

  // PUT /todos/:id - Update an existing todo
  async updateTodo(id: string, input: UpdateTodoInput): Promise<ApiResponse<Todo>> {
    await delay();

    if (shouldSimulateError()) {
      throw new ApiError({
        message: 'Failed to update todo. Please try again.',
        code: 'UPDATE_ERROR'
      });
    }

    const todoIndex = mockTodos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      throw new ApiError({
        message: 'Todo not found',
        code: 'NOT_FOUND'
      });
    }

    const updatedTodo: Todo = {
      ...mockTodos[todoIndex],
      ...input,
      updatedAt: new Date()
    };

    mockTodos[todoIndex] = updatedTodo;

    return {
      data: updatedTodo,
      message: 'Todo updated successfully',
      success: true
    };
  }

  // DELETE /todos/:id - Delete a todo
  async deleteTodo(id: string): Promise<ApiResponse<null>> {
    await delay();

    if (shouldSimulateError()) {
      throw new ApiError({
        message: 'Failed to delete todo. Please try again.',
        code: 'DELETE_ERROR'
      });
    }

    const todoIndex = mockTodos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      throw new ApiError({
        message: 'Todo not found',
        code: 'NOT_FOUND'
      });
    }

    mockTodos.splice(todoIndex, 1);

    return {
      data: null,
      message: 'Todo deleted successfully',
      success: true
    };
  }
}

// API Error class
class ApiError extends Error {
  code?: string;
  details?: any;

  constructor(error: { message: string; code?: string; details?: any }) {
    super(error.message);
    this.name = 'ApiError';
    this.code = error.code;
    this.details = error.details;
  }
}

// Export singleton instance
export const todoApi = new TodoApiService();
export { ApiError };