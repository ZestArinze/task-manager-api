import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { ProjectQuery } from './dto/project.query';
import { SearchProjectsDto } from './dto/search-projects.dto';
import { ProjectsQuery } from './dto/projects.query';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() dto: CreateProjectDto,
    @AuthUser() user: User,
  ): Promise<ProjectQuery> {
    dto.user_id = user.id;

    const result = await this.projectsService.create(dto);

    return {
      successful: true,
      message: 'Project created',
      data: result,
    };
  }

  @Post('index')
  async findMany(@Body() dto: SearchProjectsDto): Promise<ProjectsQuery> {
    const result = await this.projectsService.findMany(dto);

    return {
      successful: true,
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectQuery> {
    const result = await this.projectsService.findOne(+id);

    return {
      successful: true,
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const result = await this.projectsService.update(+id, updateProjectDto);

    return {
      successful: !!result,
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
