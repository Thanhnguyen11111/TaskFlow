import React from 'react';
import { TaskPriority, TaskStatus } from '../../types';

export function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, { bg: string; text: string; label: string }> = {
    TODO: {
      bg: 'bg-slate-100 border-slate-200 text-slate-700',
      text: 'text-slate-600',
      label: 'To Do',
    },
    IN_PROGRESS: {
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      text: 'text-amber-600',
      label: 'In Progress',
    },
    DONE: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      text: 'text-emerald-600',
      label: 'Done',
    },
  };

  const current = styles[status] || styles.TODO;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${current.text} bg-current`} />
      {current.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles: Record<TaskPriority, { bg: string; label: string }> = {
    LOW: {
      bg: 'bg-blue-50 border-blue-200 text-blue-700',
      label: 'Low',
    },
    MEDIUM: {
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      label: 'Medium',
    },
    HIGH: {
      bg: 'bg-rose-50 border-rose-200 text-rose-700',
      label: 'High',
    },
  };

  const current = styles[priority] || styles.MEDIUM;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${current.bg}`}
    >
      {current.label}
    </span>
  );
}
