import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { typeormPartialMock } from '../common/utils/test.utils';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const user = {
    id: 1,
    username: 'John Doe',
  };

  const projectData = {
    title: 'Abroad Remmitances',
    description: 'My awesome description',
    user_id: user.id,
  };

  const mockProjectRepo = {
    ...typeormPartialMock,
    create: jest.fn().mockImplementation((dto) => {
      return dto;
    }),
    save: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ id: Date.now(), ...dto });
    }),

    getMany: jest.fn().mockImplementation(() => {
      return [{ ...projectData, user: user }];
    }),
    findOne: jest.fn().mockImplementation(() => {
      return { ...projectData, user: user };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepo,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create project', async () => {
    const result = await service.create(projectData);

    expect(result).toMatchObject({
      id: expect.any(Number),
      title: projectData.title,
    });
  });

  it('should update project', async () => {
    const project = await service.create(projectData);
    const result = await service.update(project.id, projectData);

    expect(result).toBe(1);
  });

  it('should get collection of projects', async () => {
    const project = await service.create(projectData);

    const result = await service.findMany({
      user_id: user.id,
    });
    expect(result).toHaveLength(1);

    const result2 = await service.findMany({
      title: project.title,
      user_id: user.id,
    });
    expect(result2).toHaveLength(1);

    expect(result2[0]).toMatchObject({
      title: project.title,
      user_id: user.id,
      user: {
        id: user.id,
      },
    });
  });

  it('should get one project', async () => {
    const project = await service.create(projectData);
    const result = await service.findOne(project.id);

    expect(result).toMatchObject({
      title: project.title,
      user_id: user.id,
      user: {
        id: user.id,
      },
    });
  });

  it('should delete project', async () => {
    const project = await service.create(projectData);
    const result = await service.remove(project.id);

    expect(result).toBe(1);
  });
});
