'use client';

import React from 'react';
import { Calendar, CheckCircle2, Clock, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../../components/ui/badge';
import { Task, TaskStatus } from '../../types';

export interface TaskItemProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

export function TaskItem({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskItemProps) {
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
      {/* Title & Description */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onView(task)}>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {isOverdue && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
              Overdue
            </span>
          )}
        </div>
        <h4 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Due Date & Quick Status */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
        {formattedDueDate ? (
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${
              isOverdue ? 'text-rose-600' : 'text-gray-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDueDate}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-400">No deadline</div>
        )}

        {/* Status Dropdown */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
          className="text-xs font-medium py-1 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(task)}
            title="View Details"
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete Task"
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
