'use client';

import React, { useState } from 'react';
import { DashboardView } from '../../../features/dashboard/dashboard-view';
import { TaskModal } from '../../../features/tasks/task-modal';
import { taskService } from '../../../services/task.service';
import { useToast } from '../../../components/ui/toast';
import { getErrorMessage } from '../../../lib/api-client';

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();

  const handleCreateTask = async (data: any) => {
    try {
      setIsSubmitting(true);
      await taskService.createTask(data);
      toast.success('Task created successfully!');
      setIsCreateOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DashboardView onOpenCreateModal={() => setIsCreateOpen(true)} />
      <TaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={isSubmitting}
      />
    </>
  );
}
