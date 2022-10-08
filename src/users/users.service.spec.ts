import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SignupDto } from '../auth/dtos/signup.dto';
import { typeormPartialMock } from '../common/utils/test.utils';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const userData = {
    username: 'arinze@example.com',
    password: 'secret',
    password_confirmation: 'secret',
    first_name: 'John',
    last_name: 'Doe',
  };

  const mockUserRepo = {
    ...typeormPartialMock,
    create: jest.fn().mockImplementation((dto) => {
      return dto;
    }),
    save: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ id: Date.now(), ...dto });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const result = await service.create(userData);

    expect(result).toMatchObject({
      id: expect.any(Number),
      username: userData.username,
    });

    expect(result.password).toBeUndefined();
  });
});
