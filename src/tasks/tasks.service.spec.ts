import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { typeormPartialMock } from '../common/utils/test.utils';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  const project = {
    id: 1,
    title: 'Project XYZ',
  };

  const taskData = {
    title: 'Abroad Remmitances',
    description: 'My awesome description',
    project_id: project.id,
  };

  const mockTaskRepo = {
    ...typeormPartialMock,
    create: jest.fn().mockImplementation((dto) => {
      return dto;
    }),
    save: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ id: Date.now(), ...dto });
    }),
    getMany: jest.fn().mockImplementation(() => {
      return [{ ...taskData, project: project }];
    }),
    findOne: jest.fn().mockImplementation(() => {
      return { ...taskData, project: project };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepo,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create task', async () => {
    const result = await service.create(taskData);

    expect(result).toMatchObject({
      id: expect.any(Number),
      title: taskData.title,
    });
  });

  it('should update task', async () => {
    const task = await service.create(taskData);
    const result = await service.update(task.id, taskData);

    expect(result).toBe(1);
  });
});
