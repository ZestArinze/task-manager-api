import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/index.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto) {
    const taskObject = this.tasksRepository.create(dto);

    return await this.tasksRepository.save(taskObject);
  }

  async findMany(dto: SearchTasksDto) {
    console.log(dto);

    const query = this.searchQuery(dto);

    return query.select(['task', 'project.user_id', 'project.id']).getMany();
  }

  async findOne(id: number) {
    return await this.tasksRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    const result = await this.tasksRepository.update({ id: id }, dto);

    return result.affected;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  async getCount(dto: Partial<SearchTasksDto>) {
    const query = this.searchQuery(dto);

    return await query.getCount();
  }

  searchQuery(dto: Partial<SearchTasksDto>) {
    const { search, title, user_id, project_id, status } = dto;

    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoin('task.project', 'project');

    if (user_id) {
      query.andWhere('project.user_id = :user_id', { user_id });
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(task.title) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    if (project_id) {
      query.andWhere('task.project_id = :project_id', { project_id });
    }

    if (title) {
      query.andWhere('task.title = :title', { title });
    }

    if (status) {
      if (status === TaskStatus.Pending) {
        query.andWhere('task.completed_at IS NULL');
      } else if (status === TaskStatus.Completed) {
        query.andWhere('task.completed_at IS NOT NULL');
      }
    }

    return query;
  }
}
