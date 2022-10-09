import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base-entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Task extends AppBaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column()
  project_id: number;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
