import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAll(req.user.sub);
  }

  @Post()
  create(@Req() req, @Body() body: { title: string; description?: string }) {
    return this.tasksService.create(req.user.sub, body.title, body.description);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { title?: string; description?: string; completed?: boolean }) {
    return this.tasksService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}