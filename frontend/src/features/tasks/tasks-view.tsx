'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  PlusCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FilterX,
  List,
  LayoutGrid,
} from 'lucide-react';
import { taskService } from '../../services/task.service';
import {
  CreateTaskInput,
  QueryTaskParams,
  Task,
  TaskListResponse,
  TaskStatus,
  UpdateTaskInput,
} from '../../types';
import { TaskFilterBar } from './task-filter-bar';
import { TaskItem } from './task-item';
import { KanbanBoard } from './kanban-board';
import { TaskModal } from './task-modal';
import { TaskDetailModal } from './task-detail-modal';
import { ConfirmDialog } from '../../components/ui/confirm-dialog';
import { EmptyState } from '../../components/ui/empty-state';
import { TaskRowSkeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/toast';
import { getErrorMessage } from '../../lib/api-client';

export type ViewMode = 'list' | 'board';

export function TasksView({
  isCreateOpen,
  setIsCreateOpen,
}: {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
}) {
  const [tasksData, setTasksData] = useState<TaskListResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [createInitialStatus, setCreateInitialStatus] = useState<TaskStatus>('TODO');

  const [filters, setFilters] = useState<QueryTaskParams>({
    page: 1,
    limit: 8,
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Modal States
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toast = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await taskService.getTasks(filters);
      setTasksData(res);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      limit: mode === 'board' ? 50 : 8,
    }));
  };

  const handleFilterChange = (newFilters: Partial<QueryTaskParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: viewMode === 'board' ? 50 : 8,
      search: '',
      status: '',
      priority: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  // Create Task
  const handleCreateTask = async (data: any) => {
    try {
      setIsSubmitting(true);
      await taskService.createTask(data as CreateTaskInput);
      toast.success('Task created successfully!');
      setIsCreateOpen(false);
      setCreateInitialStatus('TODO');
      fetchTasks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Task
  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;
    try {
      setIsSubmitting(true);
      await taskService.updateTask(editingTask.id, data as UpdateTaskInput);
      toast.success('Task updated successfully!');
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Change with Optimistic UI Update
  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;

    // Save previous state for potential rollback
    const previousTasksData = tasksData;

    // 1. Optimistic Update in local state
    setTasksData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t,
        ),
      };
    });

    try {
      // 2. Persist to Backend API
      await taskService.updateStatus(task.id, newStatus);
      toast.success(`Moved to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      // 3. Rollback on failure
      setTasksData(previousTasksData);
      toast.error(`Failed to update status: ${getErrorMessage(error)}`);
    }
  };

  // Quick Add from Kanban Column
  const handleQuickAdd = (status: TaskStatus) => {
    setCreateInitialStatus(status);
    setIsCreateOpen(true);
  };

  // Delete Task
  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      setIsSubmitting(true);
      await taskService.deleteTask(deletingTask.id);
      toast.success('Task deleted successfully');
      setDeletingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Tasks Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, track, filter, and organize all your personal and team tasks.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Switcher (List vs Kanban Board) */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => handleViewModeChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => handleViewModeChange('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'board'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Board
            </button>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setCreateInitialStatus('TODO');
              setIsCreateOpen(true);
            }}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TaskFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Main Task View: Kanban vs List */}
      {viewMode === 'board' ? (
        isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-10 bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
                <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <KanbanBoard
            tasks={tasksData?.data || []}
            onView={(t) => setSelectedTask(t)}
            onEdit={(t) => setEditingTask(t)}
            onDelete={(t) => setDeletingTask(t)}
            onStatusChange={handleStatusChange}
            onQuickAdd={handleQuickAdd}
          />
        )
      ) : (
        /* List View */
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <TaskRowSkeleton key={i} />)
          ) : tasksData && tasksData.data.length > 0 ? (
            tasksData.data.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onView={(t) => setSelectedTask(t)}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => setDeletingTask(t)}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <EmptyState
              icon={
                filters.search || filters.status || filters.priority
                  ? FilterX
                  : CheckSquare
              }
              title={
                filters.search || filters.status || filters.priority
                  ? 'No matching tasks found'
                  : 'No tasks created yet'
              }
              description={
                filters.search || filters.status || filters.priority
                  ? 'Try adjusting your search criteria or resetting filters.'
                  : 'Get started by creating your very first task now.'
              }
              actionText={
                filters.search || filters.status || filters.priority
                  ? 'Reset Filters'
                  : 'Create Task'
              }
              onAction={
                filters.search || filters.status || filters.priority
                  ? handleResetFilters
                  : () => setIsCreateOpen(true)
              }
            />
          )}
        </div>
      )}

      {/* Pagination Controls (Only in List View) */}
      {viewMode === 'list' && tasksData && tasksData.meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 px-2">
          <p className="text-xs text-gray-500">
            Showing Page{' '}
            <strong className="text-gray-900">{tasksData.meta.page}</strong> of{' '}
            <strong className="text-gray-900">{tasksData.meta.totalPages}</strong> (
            {tasksData.meta.total} total tasks)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!tasksData.meta.hasPrevPage}
              onClick={() =>
                handleFilterChange({ page: (filters.page || 1) - 1 })
              }
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!tasksData.meta.hasNextPage}
              onClick={() =>
                handleFilterChange({ page: (filters.page || 1) + 1 })
              }
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setCreateInitialStatus('TODO');
        }}
        onSubmit={handleCreateTask}
        initialStatus={createInitialStatus}
        isLoading={isSubmitting}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
        isLoading={isSubmitting}
      />

      {/* Task Details Modal */}
      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onEdit={(t) => setEditingTask(t)}
        onDelete={(t) => setDeletingTask(t)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        isLoading={isSubmitting}
      />
    </div>
  );
}
