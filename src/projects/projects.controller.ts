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
import { UpdateResultQuery } from '../common/dtos/update-result.query';
import { DeleteResultQuery } from '../common/dtos/delete-result.query';
import { BasicPermissionHelper } from '../auth/helpers/basic-permission-helper';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly permissionHelper: BasicPermissionHelper,
  ) {}

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
  async findMany(
    @Body() dto: SearchProjectsDto,
    @AuthUser() user: User,
  ): Promise<ProjectsQuery> {
    dto.user_id = user.id;

    const result = await this.projectsService.findMany(dto);

    return {
      successful: true,
      data: result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<ProjectQuery> {
    await this.permissionHelper.checkPermission({
      userId: user.id,
      userIdFieldInSubject: 'user_id',
      subjectQueryOptions: {
        tableName: 'project',
        colName: 'id',
        value: id,
      },
    });

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
    @AuthUser() user: User,
  ): Promise<UpdateResultQuery> {
    await this.permissionHelper.checkPermission({
      userId: user.id,
      userIdFieldInSubject: 'user_id',
      subjectQueryOptions: {
        tableName: 'project',
        colName: 'id',
        value: id,
      },
    });

    const result = await this.projectsService.update(+id, updateProjectDto);

    return {
      successful: !!result,
      data: { affected: result },
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<DeleteResultQuery> {
    await this.permissionHelper.checkPermission({
      userId: user.id,
      userIdFieldInSubject: 'user_id',
      subjectQueryOptions: {
        tableName: 'project',
        colName: 'id',
        value: id,
      },
    });

    const result = await this.projectsService.remove(+id);

    return {
      successful: !!result,
      data: { affected: result },
    };
  }
}
