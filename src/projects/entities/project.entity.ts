import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base-entity';
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
}
