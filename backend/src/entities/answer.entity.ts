import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity({ name: 'answers' })
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  question!: Question;

  @Column({ nullable: true })
  audio_url!: string | null;

  @Column({ type: 'text', nullable: true })
  transcript!: string | null;

  @Column({ type: 'float', default: 0 })
  wpm!: number;

  @Column({ type: 'int', default: 0 })
  pause_count!: number;

  @Column({ type: 'int', default: 0 })
  filler_count!: number;

  @Column({ type: 'float', default: 0 })
  duration!: number;

  @Column({ type: 'float', default: 0 })
  score!: number;

  @Column({ type: 'text', nullable: true })
  feedback!: string | null;

  @Column({ type: 'text', nullable: true })
  improved_answer!: string | null;
}
