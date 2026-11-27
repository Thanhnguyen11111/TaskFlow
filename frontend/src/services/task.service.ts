import { apiClient } from '../lib/api-client';
import {
  CreateTaskInput,
  QueryTaskParams,
  Task,
  TaskListResponse,
  TaskStatus,
  UpdateTaskInput,
} from '../types';

export const taskService = {
  async getTasks(params: QueryTaskParams = {}): Promise<TaskListResponse> {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''),
    );
    const res = await apiClient.get<TaskListResponse>('/tasks', {
      params: cleanedParams,
    });
    return res.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const res = await apiClient.get<Task>(`/tasks/${id}`);
    return res.data;
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const res = await apiClient.post<Task>('/tasks', input);
    return res.data;
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const res = await apiClient.patch<Task>(`/tasks/${id}`, input);
    return res.data;
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const res = await apiClient.patch<Task>(`/tasks/${id}/status`, { status });
    return res.data;
  },

  async deleteTask(id: string): Promise<{ message: string; id: string }> {
    const res = await apiClient.delete<{ message: string; id: string }>(
      `/tasks/${id}`,
    );
    return res.data;
  },
};
