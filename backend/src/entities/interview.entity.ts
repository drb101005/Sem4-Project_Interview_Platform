import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity({ name: 'interviews' })
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.interviews, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ default: 'in_progress' })
  status!: 'in_progress' | 'completed';

  @Column()
  type!: string;

  @Column()
  difficulty!: string;

  @Column({ type: 'text' })
  resume_text!: string;

  @Column({ type: 'text', nullable: true })
  job_description!: string | null;

  @Column({ type: 'float', default: 0 })
  total_score!: number;

  @OneToMany(() => Question, (question) => question.interview)
  questions!: Question[];
}
