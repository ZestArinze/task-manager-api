import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base-entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class User extends AppBaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}
