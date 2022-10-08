import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base-entity';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Project extends AppBaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  user_id: number;
  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
