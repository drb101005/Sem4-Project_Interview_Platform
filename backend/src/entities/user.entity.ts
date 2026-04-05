import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Interview } from './interview.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({ default: 'free' })
  plan!: string;

  @Column({ type: 'int', default: 0 })
  interviews_used!: number;

  @Column({ nullable: true })
  api_key!: string | null;

  @OneToMany(() => Interview, (interview) => interview.user)
  interviews!: Interview[];
}
