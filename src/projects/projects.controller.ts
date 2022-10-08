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

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
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
