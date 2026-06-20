import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const mockTasksService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Mock del AuthGuard — lo "desactivamos" para que siempre permita pasar en los tests,
  // ya que aquí solo queremos probar la lógica del controller, no la autenticación.
  const mockAuthGuard = { canActivate: jest.fn().mockReturnValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call tasksService.findAll with the authenticated user id', async () => {
      const req = { user: { sub: 1 } };
      const expectedTasks = [{ id: 1, title: 'Task 1', userId: 1 }];

      mockTasksService.findAll.mockResolvedValue(expectedTasks);

      const result = await controller.findAll(req);

      expect(tasksService.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedTasks);
    });
  });

  describe('create', () => {
    it('should call tasksService.create with userId, title and description', async () => {
      const req = { user: { sub: 1 } };
      const body = { title: 'New Task', description: 'Details' };
      const expectedTask = { id: 1, ...body, userId: 1 };

      mockTasksService.create.mockResolvedValue(expectedTask);

      const result = await controller.create(req, body);

      expect(tasksService.create).toHaveBeenCalledWith(1, body.title, body.description);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('update', () => {
    it('should call tasksService.update with parsed id and body data', async () => {
      const id = '5';
      const body = { completed: true };
      const expectedTask = { id: 5, completed: true };

      mockTasksService.update.mockResolvedValue(expectedTask);

      const result = await controller.update(id, body);

      expect(tasksService.update).toHaveBeenCalledWith(5, body);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('remove', () => {
    it('should call tasksService.remove with parsed id', async () => {
      const id = '3';
      const expectedResult = { id: 3, title: 'Deleted Task' };

      mockTasksService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(tasksService.remove).toHaveBeenCalledWith(3);
      expect(result).toEqual(expectedResult);
    });
  });
});