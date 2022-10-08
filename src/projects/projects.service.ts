import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectsRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto) {
    const projectObject = this.projectsRepository.create(dto);

    return await this.projectsRepository.save(projectObject);
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(id: number, dto: UpdateProjectDto) {
    const result = await this.projectsRepository.update({ id: id }, dto);

    return result.affected;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
