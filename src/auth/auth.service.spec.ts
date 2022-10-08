import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { typeormPartialMock } from '../common/utils/test.utils';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

import * as bcryptjs from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;

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
    getOne: jest.fn().mockReturnValueOnce({ id: Date.now(), ...userData }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        // provide: bc,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const result = await service.signup(userData);

    expect(result).toMatchObject({
      id: expect.any(Number),
      username: userData.username,
    });

    expect(result.password).toBeUndefined();
  });

  it('should return user when supplied valid username and password', async () => {
    const spyBcrypt = jest
      .spyOn(bcryptjs, 'compare')
      .mockImplementation((a, b) => true);

    const result = await service.validateUsernameAndPassword(userData);

    expect(spyBcrypt).toHaveBeenCalled();

    expect(result).toMatchObject({
      id: expect.any(Number),
      username: userData.username,
    });
  });

  it('should return null when supplied invalid username and password', async () => {
    const result = await service.validateUsernameAndPassword(userData);

    expect(result).toBeNull();
  });
});
