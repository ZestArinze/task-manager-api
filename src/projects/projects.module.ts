import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { BasicPermissionHelper } from '../auth/helpers/basic-permission-helper';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, BasicPermissionHelper],
  imports: [TypeOrmModule.forFeature([Project]), TasksModule],
})
export class ProjectsModule {}
