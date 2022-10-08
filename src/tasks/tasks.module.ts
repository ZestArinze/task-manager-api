import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { BasicPermissionHelper } from '../auth/helpers/basic-permission-helper';

@Module({
  controllers: [TasksController],
  providers: [TasksService, BasicPermissionHelper],
  imports: [TypeOrmModule.forFeature([Task])],
  exports: [TasksService],
})
export class TasksModule {}
