'use client';

import React, { useState } from 'react';
import { TasksView } from '../../../features/tasks/tasks-view';

export default function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  return (
    <TasksView
      isCreateOpen={isCreateOpen}
      setIsCreateOpen={setIsCreateOpen}
    />
  );
}
