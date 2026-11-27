import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title.trim(),
        description: createTaskDto.description?.trim() || null,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        userId,
      },
    });
  }

  async findAll(userId: string, query: QueryTaskDto) {
    const { page = 1, limit = 10, search, status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.TaskWhereInput = {
      userId,
      ...(search && {
        title: {
          contains: search,
        },
      }),
      ...(status && { status }),
      ...(priority && { priority }),
    };

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: totalPages === 0 ? 1 : totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(userId: string, id: string, updateTaskDto: UpdateTaskDto) {
    // Ensure task exists and belongs to the user
    await this.findOne(userId, id);

    const data: Prisma.TaskUpdateInput = {};

    if (updateTaskDto.title !== undefined) {
      data.title = updateTaskDto.title.trim();
    }
    if (updateTaskDto.description !== undefined) {
      data.description = updateTaskDto.description ? updateTaskDto.description.trim() : null;
    }
    if (updateTaskDto.status !== undefined) {
      data.status = updateTaskDto.status;
    }
    if (updateTaskDto.priority !== undefined) {
      data.priority = updateTaskDto.priority;
    }
    if (updateTaskDto.dueDate !== undefined) {
      data.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null;
    }

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async updateStatus(userId: string, id: string, updateStatusDto: UpdateTaskStatusDto) {
    await this.findOne(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.task.delete({
      where: { id },
    });

    return {
      message: 'Task deleted successfully',
      id,
    };
  }
}
