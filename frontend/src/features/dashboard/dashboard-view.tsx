'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertTriangle,
  TrendingUp,
  Layers,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../types';
import { StatCardSkeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/toast';
import { getErrorMessage } from '../../lib/api-client';

export function DashboardView({
  onOpenCreateModal,
}: {
  onOpenCreateModal: () => void;
}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome & Action Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to TaskFlow
          </h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Stay organized, meet your deadlines, and track your task progress in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold"
            onClick={onOpenCreateModal}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Task
          </Button>
          <a
            href="/tasks"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-700/60 hover:bg-indigo-700 text-white transition-colors border border-indigo-500/30"
          >
            All Tasks
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </a>
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {!isLoading && stats && stats.overdueTasks > 0 && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p>
            You have{' '}
            <strong className="font-semibold underline">
              {stats.overdueTasks} overdue {stats.overdueTasks === 1 ? 'task' : 'tasks'}
            </strong>{' '}
            requiring your attention.{' '}
            <a href="/tasks?status=TODO" className="font-bold underline hover:text-rose-900">
              View overdue tasks &rarr;
            </a>
          </p>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Task Statistics Overview
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Total Tasks */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Tasks
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {stats.totalTasks}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Completed
                </p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                  {stats.completedTasks}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* In Progress Tasks */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  In Progress
                </p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">
                  {stats.inProgressTasks}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  To Do (Pending)
                </p>
                <p className="text-3xl font-extrabold text-slate-700 mt-1">
                  {stats.pendingTasks}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <ListTodo className="w-6 h-6" />
              </div>
            </div>

            {/* Overdue Tasks */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Overdue
                </p>
                <p
                  className={`text-3xl font-extrabold mt-1 ${
                    stats.overdueTasks > 0 ? 'text-rose-600' : 'text-gray-900'
                  }`}
                >
                  {stats.overdueTasks}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stats.overdueTasks > 0
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Completion Rate
                  </p>
                  <p className="text-3xl font-extrabold text-indigo-600 mt-1">
                    {stats.completionRate}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, stats.completionRate))}%` }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
