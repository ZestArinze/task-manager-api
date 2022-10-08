import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { typeormPartialMock } from '../common/utils/test.utils';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const projectData = {
    title: 'Abroad Remmitances',
    description: 'My awesome description',
    user_id: 1,
  };

  const mockProjectRepo = {
    ...typeormPartialMock,
    create: jest.fn().mockImplementation((dto) => {
      return dto;
    }),
    save: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ id: Date.now(), ...dto });
    }),
    update: jest.fn().mockImplementation((dto) => {
      return { affected: 1 };
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
});
