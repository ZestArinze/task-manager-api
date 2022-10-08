import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupDto } from '../auth/dtos/signup.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(dto: SignupDto) {
    const userObject = this.usersRepository.create(dto);
    const user = await this.usersRepository.save(userObject);
    delete user.password;

    return user;
  }

  async findOne(username: string, options?: { selectSecrets: boolean }) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select('user');

    if (options && options.selectSecrets) {
      query.addSelect(['user.password']);
    }

    query.where('user.username = :username', { username });

    return await query.getOne();
  }
}
