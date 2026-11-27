'use client';

import React from 'react';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button';
import { PriorityBadge, StatusBadge } from '../../components/ui/badge';
import { Task } from '../../types';

export interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
}: TaskDetailModalProps) {
  if (!task) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No deadline set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue =
    task.status !== 'DONE' &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="md"
    >
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {isOverdue && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                Overdue
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-snug">
            {task.title}
          </h2>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            Description
          </h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3.5 rounded-lg border border-gray-100 leading-relaxed">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              <strong className="text-gray-700">Due:</strong> {formatDate(task.dueDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              <strong className="text-gray-700">Created:</strong> {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Task
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
