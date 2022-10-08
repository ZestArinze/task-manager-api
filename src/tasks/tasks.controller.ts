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

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
