'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Edit2,
  Eye,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { PriorityBadge } from '../../components/ui/badge';
import { Task, TaskPriority, TaskStatus } from '../../types';

export interface KanbanBoardProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  onQuickAdd: (status: TaskStatus) => void;
}

interface ColumnConfig {
  status: TaskStatus;
  title: string;
  badgeBg: string;
  badgeText: string;
  borderHover: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    status: 'TODO',
    title: 'To Do',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    badgeText: 'text-slate-600',
    borderHover: 'border-indigo-400 bg-indigo-50/30',
  },
  {
    status: 'IN_PROGRESS',
    title: 'In Progress',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-600',
    borderHover: 'border-amber-400 bg-amber-50/30',
  },
  {
    status: 'DONE',
    title: 'Done',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-600',
    borderHover: 'border-emerald-400 bg-emerald-50/30',
  },
];

export function KanbanBoard({
  tasks,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onQuickAdd,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<TaskStatus | null>(null);

  // Group tasks by status
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter((t) => t.status === 'DONE'),
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== status) {
      setActiveDropColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: TaskStatus) => {
    // Only reset if we actually leave the column container
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      if (activeDropColumn === status) {
        setActiveDropColumn(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      onStatusChange(task, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasksByStatus[col.status];
        const isColumnActive = activeDropColumn === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={(e) => handleDragLeave(e, col.status)}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`flex flex-col rounded-xl border bg-slate-100/60 transition-all duration-200 min-h-[500px] ${
              isColumnActive
                ? `${col.borderHover} ring-2 ring-indigo-400 ring-offset-2 border-dashed`
                : 'border-slate-200'
            }`}
          >
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-sm rounded-t-xl">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-gray-800">{col.title}</h3>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${col.badgeBg}`}
                >
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => onQuickAdd(col.status)}
                title={`Add task to ${col.title}`}
                className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards List */}
            <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 p-4 text-center">
                  <span>No tasks in this column</span>
                  <span className="text-[11px] text-gray-400 mt-1">
                    Drag tasks here to update
                  </span>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isBeingDragged = draggedTaskId === task.id;
                  const isOverdue =
                    task.status !== 'DONE' &&
                    task.dueDate &&
                    new Date(task.dueDate) < new Date();

                  const formattedDueDate = task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : null;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className={`group bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none ${
                        isBeingDragged
                          ? 'opacity-40 scale-95 border-dashed border-indigo-400'
                          : 'opacity-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <PriorityBadge priority={task.priority} />
                        <GripVertical className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-0.5" />
                      </div>

                      <h4
                        onClick={() => onView(task)}
                        className="text-sm font-semibold text-gray-900 leading-snug hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs">
                        {formattedDueDate ? (
                          <div
                            className={`flex items-center gap-1 font-medium ${
                              isOverdue ? 'text-rose-600' : 'text-gray-500'
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            <span>{formattedDueDate}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No date</span>
                        )}

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onView(task)}
                            title="View"
                            className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEdit(task)}
                            title="Edit"
                            className="p-1 text-gray-400 hover:text-amber-600 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(task)}
                            title="Delete"
                            className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
