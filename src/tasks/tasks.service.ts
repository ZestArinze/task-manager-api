import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto) {
    const taskObject = this.tasksRepository.create(dto);

    return await this.tasksRepository.save(taskObject);
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const result = await this.tasksRepository.update({ id: id }, dto);

    return result.affected;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
