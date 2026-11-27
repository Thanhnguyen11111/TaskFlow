import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const now = new Date();

    const [totalTasks, completedTasks, inProgressTasks, pendingTasks, overdueTasks] =
      await Promise.all([
        this.prisma.task.count({
          where: { userId },
        }),
        this.prisma.task.count({
          where: { userId, status: 'DONE' },
        }),
        this.prisma.task.count({
          where: { userId, status: 'IN_PROGRESS' },
        }),
        this.prisma.task.count({
          where: { userId, status: 'TODO' },
        }),
        this.prisma.task.count({
          where: {
            userId,
            status: { not: 'DONE' },
            dueDate: { lt: now },
          },
        }),
      ]);

    const completionRate =
      totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
    };
  }
}
