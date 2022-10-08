import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base-entity';

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
}
