'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { QueryTaskParams, TaskPriority, TaskStatus } from '../../types';

export interface TaskFilterBarProps {
  filters: QueryTaskParams;
  onFilterChange: (newFilters: Partial<QueryTaskParams>) => void;
  onReset: () => void;
}

export function TaskFilterBar({
  filters,
  onFilterChange,
  onReset,
}: TaskFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={filters.status || ''}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as TaskStatus | '',
                page: 1,
              })
            }
            className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="w-full md:w-44">
          <select
            value={filters.priority || ''}
            onChange={(e) =>
              onFilterChange({
                priority: e.target.value as TaskPriority | '',
                page: 1,
              })
            }
            className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="w-full md:w-48">
          <select
            value={`${filters.sortBy || 'createdAt'}_${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('_');
              onFilterChange({
                sortBy: sortBy as QueryTaskParams['sortBy'],
                sortOrder: sortOrder as 'asc' | 'desc',
                page: 1,
              });
            }}
            className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            <option value="createdAt_desc">Newest Created</option>
            <option value="createdAt_asc">Oldest Created</option>
            <option value="dueDate_asc">Due Date (Earliest)</option>
            <option value="dueDate_desc">Due Date (Latest)</option>
            <option value="title_asc">Title (A - Z)</option>
            <option value="title_desc">Title (Z - A)</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          title="Reset filters"
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors shrink-0 flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
