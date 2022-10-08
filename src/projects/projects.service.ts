import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { SearchProjectsDto } from './dto/search-projects.dto';
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

  async findMany(dto: SearchProjectsDto) {
    const query = this.searchQuery(dto);

    return query
      .leftJoin('project.user', 'user')
      .select(['project', 'user.id'])
      .getMany();
  }

  findOne(id: number) {
    return this.projectsRepository.findOne({ where: { id: id } });
  }

  async update(id: number, dto: UpdateProjectDto) {
    const result = await this.projectsRepository.update({ id: id }, dto);

    return result.affected;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  searchQuery(dto: SearchProjectsDto) {
    console.log({ dto });

    const { search, title } = dto;

    const query = this.projectsRepository.createQueryBuilder('project');

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(project.title) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    if (title) {
      query.andWhere('project.title = :title', { title });
    }

    return query;
  }
}
