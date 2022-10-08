import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { TaskQuery } from './dto/task.query';
import { BasicPermissionHelper } from '../auth/helpers/basic-permission-helper';
import { UpdateResultQuery } from '../common/dtos/update-result.query';
import { SearchTasksDto } from './dto/search-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly permissionHelper: BasicPermissionHelper,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateTaskDto,
    @AuthUser() user: User,
  ): Promise<TaskQuery> {
    await this.permissionHelper.checkPermission({
      userId: user.id,
      userIdFieldInSubject: 'user_id',
      subjectQueryOptions: {
        tableName: 'project',
        colName: 'id',
        value: dto.project_id,
      },
    });

    const result = await this.tasksService.create(dto);

    return {
      successful: true,
      message: 'Task created',
      data: result,
    };
  }

  @Post('index')
  async findMany(@Body() dto: SearchTasksDto, @AuthUser() user: User) {
    dto.user_id = user.id;

    const result = await this.tasksService.findMany(dto);

    return {
      successful: true,
      data: result,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @AuthUser() user: User,
  ): Promise<UpdateResultQuery> {
    await this.permissionHelper.checkPermission({
      userId: user.id,
      userIdFieldInSubject: 'user_id',
      subjectQueryOptions: {
        tableName: 'project',
        colName: 'id',
        value: dto.project_id,
      },
    });

    const result = await this.tasksService.update(+id, dto);

    return {
      successful: !!result,
      data: {
        affected: result,
      },
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
