import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import {
  BasicPermissionHelper,
  unauthorizedMessage,
} from '../auth/helpers/basic-permission-helper';
import { UpdateResultQuery } from '../common/dtos/update-result.query';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';
import { TaskQuery } from './dto/task.query';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

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
    await this.checkPermissionById(user.id, null, dto.project_id);

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
  async findOne(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<TaskQuery> {
    await this.checkPermissionById(user.id, id);

    const result = await this.tasksService.findOne(id);

    return {
      successful: true,
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateTaskDto,
    @AuthUser() user: User,
  ): Promise<UpdateResultQuery> {
    const task = await this.tasksService.findOne(id);

    await this.checkPermissionById(user.id, null, task?.project_id);

    if (task?.completed_at) {
      return {
        successful: false,
        message: 'You cannot edit a completed task',
      };
    }

    const result = await this.tasksService.update(id, dto);

    return {
      successful: !!result,
      message: result > 0 ? 'Task updated' : null,
      data: {
        affected: result,
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @AuthUser() user: User) {
    const task = await this.tasksService.findOne(id);
    await this.checkPermissionById(user.id, null, task?.project_id);
    if (task?.completed_at) {
      return {
        successful: false,
        message: 'You cannot delete a completed task',
      };
    }

    const result = await this.tasksService.remove(id);

    return {
      successful: !!result,

      data: { affected: result },
    };
  }

  async checkPermissionById(
    userId: number,
    id: number | null,
    taskProjectId?: number,
  ) {
    let projectId: number;

    if (taskProjectId) {
      projectId = taskProjectId;
    } else {
      if (!id) {
        throw new UnauthorizedException(unauthorizedMessage);
      }

      const task = await this.tasksService.findOne(id);

      projectId = task?.project_id;
    }

    await this.permissionHelper.checkPermission({
      userId: userId,
      userIdFieldInSubject: 'user_id',
      subjectQueryOptions: {
        tableName: 'project',
        colName: 'id',
        value: projectId,
      },
    });
  }
}
