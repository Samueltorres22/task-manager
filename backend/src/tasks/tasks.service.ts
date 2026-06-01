import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  create(userId: number, title: string, description?: string) {
    return this.prisma.task.create({
      data: { title, description, userId },
    });
  }

  update(id: number, data: { title?: string; description?: string; completed?: boolean }) {
    return this.prisma.task.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}